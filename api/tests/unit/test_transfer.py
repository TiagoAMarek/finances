import pytest
from datetime import date
from pydantic import ValidationError as PydanticValidationError
from app.services import TransactionService
from app.schemas import TransferCreate
from app.utils.exceptions import ValidationError, NotFoundError


class TestTransferService:
    def test_create_transfer_success(self, test_db, test_user):
        # Create two accounts for the user
        from app.models import BankAccount
        
        source_account = BankAccount(
            name="Source Account",
            balance=1000.0,
            currency="BRL",
            owner_id=test_user.id
        )
        dest_account = BankAccount(
            name="Destination Account", 
            balance=500.0,
            currency="BRL",
            owner_id=test_user.id
        )
        test_db.add(source_account)
        test_db.add(dest_account)
        test_db.commit()
        test_db.refresh(source_account)
        test_db.refresh(dest_account)
        
        # Create transfer
        transfer_data = TransferCreate(
            description="Test transfer",
            amount=200.0,
            date=date.today(),
            from_account_id=source_account.id,
            to_account_id=dest_account.id
        )
        
        transfer = TransactionService.create_transfer(test_db, test_user.id, transfer_data)
        
        # Verify transfer was created
        assert transfer.type == "transfer"
        assert transfer.amount == 200.0
        assert transfer.account_id == source_account.id
        assert transfer.to_account_id == dest_account.id
        assert transfer.category == "Transfer"
        
        # Verify balances were updated
        test_db.refresh(source_account)
        test_db.refresh(dest_account)
        assert source_account.balance == 800.0  # 1000 - 200
        assert dest_account.balance == 700.0    # 500 + 200
    
    def test_create_transfer_insufficient_balance(self, test_db, test_user):
        from app.models import BankAccount
        
        source_account = BankAccount(
            name="Source Account",
            balance=100.0,  # Not enough for 200 transfer
            currency="BRL",
            owner_id=test_user.id
        )
        dest_account = BankAccount(
            name="Destination Account",
            balance=0.0,
            currency="BRL",
            owner_id=test_user.id
        )
        test_db.add(source_account)
        test_db.add(dest_account)
        test_db.commit()
        test_db.refresh(source_account)
        test_db.refresh(dest_account)
        
        transfer_data = TransferCreate(
            description="Test transfer",
            amount=200.0,
            date=date.today(),
            from_account_id=source_account.id,
            to_account_id=dest_account.id
        )
        
        with pytest.raises(ValidationError, match="Insufficient balance"):
            TransactionService.create_transfer(test_db, test_user.id, transfer_data)
    
    def test_create_transfer_same_account(self, test_db, test_user):
        from app.models import BankAccount
        
        account = BankAccount(
            name="Test Account",
            balance=1000.0,
            currency="BRL",
            owner_id=test_user.id
        )
        test_db.add(account)
        test_db.commit()
        test_db.refresh(account)
        
        # Should fail validation in the schema during creation
        with pytest.raises(PydanticValidationError, match="Cannot transfer to the same account"):
            TransferCreate(
                description="Invalid transfer",
                amount=100.0,
                date=date.today(),
                from_account_id=account.id,
                to_account_id=account.id
            )
    
    def test_create_transfer_unauthorized_account(self, test_db, test_user):
        from app.models import BankAccount, User
        from app.services.auth import AuthService
        
        # Create another user and their account
        other_user = User(
            email="other@example.com",
            hashed_password=AuthService.hash_password("password123")
        )
        test_db.add(other_user)
        test_db.commit()
        test_db.refresh(other_user)
        
        user_account = BankAccount(
            name="User Account",
            balance=1000.0,
            currency="BRL",
            owner_id=test_user.id
        )
        other_account = BankAccount(
            name="Other User Account",
            balance=500.0,
            currency="BRL",
            owner_id=other_user.id
        )
        test_db.add(user_account)
        test_db.add(other_account)
        test_db.commit()
        test_db.refresh(user_account)
        test_db.refresh(other_account)
        
        # Try to transfer to other user's account
        transfer_data = TransferCreate(
            description="Unauthorized transfer",
            amount=100.0,
            date=date.today(),
            from_account_id=user_account.id,
            to_account_id=other_account.id
        )
        
        with pytest.raises(NotFoundError, match="not found or not authorized"):
            TransactionService.create_transfer(test_db, test_user.id, transfer_data)
    
    def test_transfer_updates_both_balances_atomically(self, test_db, test_user):
        from app.models import BankAccount
        
        source_account = BankAccount(
            name="Source Account",
            balance=1000.0,
            currency="BRL",
            owner_id=test_user.id
        )
        dest_account = BankAccount(
            name="Destination Account",
            balance=200.0,
            currency="BRL", 
            owner_id=test_user.id
        )
        test_db.add(source_account)
        test_db.add(dest_account)
        test_db.commit()
        
        # Store initial balances
        initial_source_balance = source_account.balance
        initial_dest_balance = dest_account.balance
        transfer_amount = 300.0
        
        transfer_data = TransferCreate(
            description="Atomic transfer test",
            amount=transfer_amount,
            date=date.today(),
            from_account_id=source_account.id,
            to_account_id=dest_account.id
        )
        
        TransactionService.create_transfer(test_db, test_user.id, transfer_data)
        
        # Verify both accounts updated correctly
        test_db.refresh(source_account)
        test_db.refresh(dest_account)
        
        assert source_account.balance == initial_source_balance - transfer_amount
        assert dest_account.balance == initial_dest_balance + transfer_amount
        
        # Verify total balance is conserved
        final_total = source_account.balance + dest_account.balance
        initial_total = initial_source_balance + initial_dest_balance
        assert final_total == initial_total