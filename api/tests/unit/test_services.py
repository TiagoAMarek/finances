import pytest
from datetime import date
from unittest.mock import patch
from app.services import AuthService, AccountService, TransactionService
from app.schemas import (
    UserCreate, UserLogin, BankAccountCreate, BankAccountUpdate,
    CreditCardCreate, CreditCardUpdate, TransactionCreate
)
from app.utils.exceptions import ConflictError, UnauthorizedError, NotFoundError


class TestAuthService:
    def test_create_user_success(self, test_db):
        user_data = UserCreate(email="newuser@example.com", password="password123")
        user = AuthService.create_user(test_db, user_data)
        
        assert user.email == "newuser@example.com"
        assert user.hashed_password != "password123"  # Should be hashed
        assert AuthService.verify_password("password123", user.hashed_password)
    
    def test_create_user_duplicate_email(self, test_db, test_user):
        user_data = UserCreate(email=test_user.email, password="password123")
        
        with pytest.raises(ConflictError):
            AuthService.create_user(test_db, user_data)
    
    @patch('app.services.auth.create_access_token')
    def test_authenticate_user_success(self, mock_create_token, test_db, test_user):
        mock_create_token.return_value = "fake_token_123"
        
        login_data = UserLogin(email=test_user.email, password="testpassword123")
        token = AuthService.authenticate_user(test_db, login_data)
        
        assert token == "fake_token_123"
        mock_create_token.assert_called_once_with(identity=test_user.id)
    
    def test_authenticate_user_invalid_credentials(self, test_db, test_user):
        login_data = UserLogin(email=test_user.email, password="wrongpassword")
        
        with pytest.raises(UnauthorizedError):
            AuthService.authenticate_user(test_db, login_data)


class TestAccountService:
    def test_create_bank_account(self, test_db, test_user):
        account_data = BankAccountCreate(name="Test Account", balance=500.0)
        account = AccountService.create_bank_account(test_db, test_user.id, account_data)
        
        assert account.name == "Test Account"
        assert account.balance == 500.0
        assert account.owner_id == test_user.id
    
    def test_get_user_bank_accounts(self, test_db, test_user, test_bank_account):
        accounts = AccountService.get_user_bank_accounts(test_db, test_user.id)
        
        assert len(accounts) == 1
        assert accounts[0].id == test_bank_account.id
    
    def test_update_bank_account(self, test_db, test_user, test_bank_account):
        update_data = BankAccountUpdate(name="Updated Account", balance=1500.0)
        updated_account = AccountService.update_bank_account(
            test_db, test_user.id, test_bank_account.id, update_data
        )
        
        assert updated_account.name == "Updated Account"
        assert updated_account.balance == 1500.0
    
    def test_delete_bank_account(self, test_db, test_user, test_bank_account):
        AccountService.delete_bank_account(test_db, test_user.id, test_bank_account.id)
        
        with pytest.raises(NotFoundError):
            AccountService.get_bank_account_by_id(test_db, test_user.id, test_bank_account.id)


class TestTransactionService:
    def test_create_transaction_updates_account_balance(self, test_db, test_user, test_bank_account):
        initial_balance = test_bank_account.balance
        transaction_data = TransactionCreate(
            description="Test transaction",
            amount=100.0,
            type="expense",
            date=date.today(),
            category="Test",
            account_id=test_bank_account.id
        )
        
        transaction = TransactionService.create_transaction(test_db, test_user.id, transaction_data)
        test_db.refresh(test_bank_account)
        
        assert transaction.description == "Test transaction"
        assert test_bank_account.balance == initial_balance - 100.0
    
    def test_create_transaction_updates_credit_card_bill(self, test_db, test_user, test_credit_card):
        initial_bill = test_credit_card.current_bill
        transaction_data = TransactionCreate(
            description="Credit card purchase",
            amount=200.0,
            type="expense",
            date=date.today(),
            category="Shopping",
            credit_card_id=test_credit_card.id
        )
        
        transaction = TransactionService.create_transaction(test_db, test_user.id, transaction_data)
        test_db.refresh(test_credit_card)
        
        assert transaction.description == "Credit card purchase"
        assert test_credit_card.current_bill == initial_bill + 200.0
    
    def test_delete_transaction_reverts_balance(self, test_db, test_user, test_bank_account):
        # Create transaction first
        transaction_data = TransactionCreate(
            description="Test transaction",
            amount=100.0,
            type="income",
            date=date.today(),
            category="Test",
            account_id=test_bank_account.id
        )
        
        transaction = TransactionService.create_transaction(test_db, test_user.id, transaction_data)
        test_db.refresh(test_bank_account)
        balance_after_create = test_bank_account.balance
        
        # Delete transaction
        TransactionService.delete_transaction(test_db, test_user.id, transaction.id)
        test_db.refresh(test_bank_account)
        
        assert test_bank_account.balance == balance_after_create - 100.0