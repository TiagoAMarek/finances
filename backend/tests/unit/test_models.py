import pytest
from app.models import User, BankAccount, CreditCard, Transaction
from app.services.auth import AuthService
from datetime import date


class TestUserModel:
    def test_user_creation(self, test_db):
        user = User(
            email="test@example.com",
            hashed_password=AuthService.hash_password("password123")
        )
        test_db.add(user)
        test_db.commit()
        
        assert user.id is not None
        assert user.email == "test@example.com"
        assert user.hashed_password != "password123"
    
    def test_user_relationships(self, test_db, test_user, test_bank_account, test_credit_card):
        # Refresh to get relationships
        test_db.refresh(test_user)
        
        assert len(test_user.accounts) == 1
        assert test_user.accounts[0].id == test_bank_account.id
        assert len(test_user.credit_cards) == 1
        assert test_user.credit_cards[0].id == test_credit_card.id


class TestBankAccountModel:
    def test_account_creation(self, test_db, test_user):
        account = BankAccount(
            name="Test Account",
            balance=1000.0,
            currency="USD",
            owner_id=test_user.id
        )
        test_db.add(account)
        test_db.commit()
        
        assert account.id is not None
        assert account.name == "Test Account"
        assert account.balance == 1000.0
        assert account.currency == "USD"
        assert account.owner_id == test_user.id
    
    def test_account_default_values(self, test_db, test_user):
        account = BankAccount(
            name="Test Account",
            owner_id=test_user.id
        )
        test_db.add(account)
        test_db.commit()
        
        assert account.balance == 0.0
        assert account.currency == "BRL"


class TestCreditCardModel:
    def test_credit_card_creation(self, test_db, test_user):
        card = CreditCard(
            name="Test Card",
            limit=5000.0,
            current_bill=1000.0,
            owner_id=test_user.id
        )
        test_db.add(card)
        test_db.commit()
        
        assert card.id is not None
        assert card.name == "Test Card"
        assert card.limit == 5000.0
        assert card.current_bill == 1000.0
        assert card.owner_id == test_user.id
    
    def test_credit_card_default_values(self, test_db, test_user):
        card = CreditCard(
            name="Test Card",
            owner_id=test_user.id
        )
        test_db.add(card)
        test_db.commit()
        
        assert card.limit == 0.0
        assert card.current_bill == 0.0


class TestTransactionModel:
    def test_transaction_creation(self, test_db, test_user, test_bank_account):
        transaction = Transaction(
            description="Test transaction",
            amount=100.0,
            type="income",
            date=date.today(),
            category="Salary",
            owner_id=test_user.id,
            account_id=test_bank_account.id
        )
        test_db.add(transaction)
        test_db.commit()
        
        assert transaction.id is not None
        assert transaction.description == "Test transaction"
        assert transaction.amount == 100.0
        assert transaction.type == "income"
        assert transaction.category == "Salary"
        assert transaction.owner_id == test_user.id
        assert transaction.account_id == test_bank_account.id
        assert transaction.credit_card_id is None
    
    def test_transaction_with_credit_card(self, test_db, test_user, test_credit_card):
        transaction = Transaction(
            description="Credit card purchase",
            amount=50.0,
            type="expense",
            date=date.today(),
            category="Shopping",
            owner_id=test_user.id,
            credit_card_id=test_credit_card.id
        )
        test_db.add(transaction)
        test_db.commit()
        
        assert transaction.credit_card_id == test_credit_card.id
        assert transaction.account_id is None