from typing import List
from sqlalchemy.orm import Session
from app.models import BankAccount, CreditCard
from app.schemas import (
    BankAccountCreate, BankAccountUpdate, BankAccountResponse,
    CreditCardCreate, CreditCardUpdate, CreditCardResponse
)
from app.utils.exceptions import NotFoundError, UnauthorizedError


class AccountService:
    @staticmethod
    def create_bank_account(db: Session, user_id: int, account_data: BankAccountCreate) -> BankAccount:
        new_account = BankAccount(
            name=account_data.name,
            balance=account_data.balance,
            currency=account_data.currency,
            owner_id=user_id
        )
        db.add(new_account)
        db.commit()
        db.refresh(new_account)
        return new_account
    
    @staticmethod
    def get_user_bank_accounts(db: Session, user_id: int) -> List[BankAccount]:
        return db.query(BankAccount).filter(BankAccount.owner_id == user_id).all()
    
    @staticmethod
    def get_bank_account_by_id(db: Session, user_id: int, account_id: int) -> BankAccount:
        account = db.query(BankAccount).filter(
            BankAccount.id == account_id,
            BankAccount.owner_id == user_id
        ).first()
        if not account:
            raise NotFoundError("Account not found or not authorized")
        return account
    
    @staticmethod
    def update_bank_account(db: Session, user_id: int, account_id: int, update_data: BankAccountUpdate) -> BankAccount:
        account = AccountService.get_bank_account_by_id(db, user_id, account_id)
        
        for field, value in update_data.dict(exclude_unset=True).items():
            setattr(account, field, value)
        
        db.commit()
        db.refresh(account)
        return account
    
    @staticmethod
    def delete_bank_account(db: Session, user_id: int, account_id: int) -> None:
        account = AccountService.get_bank_account_by_id(db, user_id, account_id)
        db.delete(account)
        db.commit()
    
    @staticmethod
    def create_credit_card(db: Session, user_id: int, card_data: CreditCardCreate) -> CreditCard:
        new_card = CreditCard(
            name=card_data.name,
            limit=card_data.limit,
            current_bill=card_data.current_bill,
            owner_id=user_id
        )
        db.add(new_card)
        db.commit()
        db.refresh(new_card)
        return new_card
    
    @staticmethod
    def get_user_credit_cards(db: Session, user_id: int) -> List[CreditCard]:
        return db.query(CreditCard).filter(CreditCard.owner_id == user_id).all()
    
    @staticmethod
    def get_credit_card_by_id(db: Session, user_id: int, card_id: int) -> CreditCard:
        card = db.query(CreditCard).filter(
            CreditCard.id == card_id,
            CreditCard.owner_id == user_id
        ).first()
        if not card:
            raise NotFoundError("Credit card not found or not authorized")
        return card
    
    @staticmethod
    def update_credit_card(db: Session, user_id: int, card_id: int, update_data: CreditCardUpdate) -> CreditCard:
        card = AccountService.get_credit_card_by_id(db, user_id, card_id)
        
        for field, value in update_data.dict(exclude_unset=True).items():
            setattr(card, field, value)
        
        db.commit()
        db.refresh(card)
        return card
    
    @staticmethod
    def delete_credit_card(db: Session, user_id: int, card_id: int) -> None:
        card = AccountService.get_credit_card_by_id(db, user_id, card_id)
        db.delete(card)
        db.commit()
