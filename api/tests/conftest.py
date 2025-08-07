import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models import User, BankAccount, CreditCard, Transaction
from app.services.auth import AuthService
from flask_jwt_extended import create_access_token
import tempfile
import os


@pytest.fixture(scope="function")
def test_db():
    # Create temporary in-memory database for each test
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def test_user(test_db):
    user = User(
        email="test@example.com",
        hashed_password=AuthService.hash_password("testpassword123")
    )
    test_db.add(user)
    test_db.commit()
    test_db.refresh(user)
    return user


@pytest.fixture
def auth_token(test_user):
    return create_access_token(identity=test_user.id)


@pytest.fixture
def test_bank_account(test_db, test_user):
    account = BankAccount(
        name="Test Account",
        balance=1000.0,
        currency="BRL",
        owner_id=test_user.id
    )
    test_db.add(account)
    test_db.commit()
    test_db.refresh(account)
    return account


@pytest.fixture
def test_credit_card(test_db, test_user):
    card = CreditCard(
        name="Test Card",
        limit=5000.0,
        current_bill=500.0,
        owner_id=test_user.id
    )
    test_db.add(card)
    test_db.commit()
    test_db.refresh(card)
    return card