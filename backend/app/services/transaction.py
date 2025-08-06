from typing import List
from datetime import date
from sqlalchemy import extract
from sqlalchemy.orm import Session
from app.models import Transaction, BankAccount, CreditCard
from app.schemas import TransactionCreate, TransactionUpdate, TransactionResponse, MonthlySummaryResponse
from app.utils.exceptions import NotFoundError, ValidationError
from app.services.account import AccountService


class TransactionService:
    @staticmethod
    def _validate_transaction_ownership(db: Session, user_id: int, transaction_data):
        if transaction_data.account_id:
            AccountService.get_bank_account_by_id(db, user_id, transaction_data.account_id)
        elif transaction_data.credit_card_id:
            AccountService.get_credit_card_by_id(db, user_id, transaction_data.credit_card_id)
    
    @staticmethod
    def _update_balances_for_new_transaction(db: Session, transaction: Transaction):
        if transaction.account_id:
            account = db.query(BankAccount).filter(BankAccount.id == transaction.account_id).first()
            if account:
                if transaction.type == 'income':
                    account.balance += transaction.amount
                else:
                    account.balance -= transaction.amount
        elif transaction.credit_card_id:
            card = db.query(CreditCard).filter(CreditCard.id == transaction.credit_card_id).first()
            if card:
                if transaction.type == 'expense':
                    card.current_bill += transaction.amount
                else:  # income on credit card is a refund
                    card.current_bill -= transaction.amount
    
    @staticmethod
    def _revert_balances_for_transaction(db: Session, transaction: Transaction):
        if transaction.account_id:
            account = db.query(BankAccount).filter(BankAccount.id == transaction.account_id).first()
            if account:
                if transaction.type == 'income':
                    account.balance -= transaction.amount
                else:
                    account.balance += transaction.amount
        elif transaction.credit_card_id:
            card = db.query(CreditCard).filter(CreditCard.id == transaction.credit_card_id).first()
            if card:
                if transaction.type == 'expense':
                    card.current_bill -= transaction.amount
                else:
                    card.current_bill += transaction.amount
    
    @staticmethod
    def create_transaction(db: Session, user_id: int, transaction_data: TransactionCreate) -> Transaction:
        TransactionService._validate_transaction_ownership(db, user_id, transaction_data)
        
        new_transaction = Transaction(
            description=transaction_data.description,
            amount=transaction_data.amount,
            type=transaction_data.type,
            date=transaction_data.date,
            category=transaction_data.category,
            owner_id=user_id,
            account_id=transaction_data.account_id,
            credit_card_id=transaction_data.credit_card_id
        )
        
        db.add(new_transaction)
        TransactionService._update_balances_for_new_transaction(db, new_transaction)
        db.commit()
        db.refresh(new_transaction)
        return new_transaction
    
    @staticmethod
    def get_user_transactions(db: Session, user_id: int) -> List[Transaction]:
        return db.query(Transaction).filter(Transaction.owner_id == user_id).all()
    
    @staticmethod
    def get_transaction_by_id(db: Session, user_id: int, transaction_id: int) -> Transaction:
        transaction = db.query(Transaction).filter(
            Transaction.id == transaction_id,
            Transaction.owner_id == user_id
        ).first()
        if not transaction:
            raise NotFoundError("Transaction not found or not authorized")
        return transaction
    
    @staticmethod
    def update_transaction(db: Session, user_id: int, transaction_id: int, update_data: TransactionUpdate) -> Transaction:
        transaction = TransactionService.get_transaction_by_id(db, user_id, transaction_id)
        
        # Revert old balances
        TransactionService._revert_balances_for_transaction(db, transaction)
        
        # Update transaction fields
        for field, value in update_data.dict(exclude_unset=True).items():
            setattr(transaction, field, value)
        
        # Validate new ownership if account/card changed
        if hasattr(update_data, 'account_id') or hasattr(update_data, 'credit_card_id'):
            TransactionService._validate_transaction_ownership(db, user_id, transaction)
        
        # Apply new balances
        TransactionService._update_balances_for_new_transaction(db, transaction)
        
        db.commit()
        db.refresh(transaction)
        return transaction
    
    @staticmethod
    def delete_transaction(db: Session, user_id: int, transaction_id: int) -> None:
        transaction = TransactionService.get_transaction_by_id(db, user_id, transaction_id)
        
        # Revert balances
        TransactionService._revert_balances_for_transaction(db, transaction)
        
        db.delete(transaction)
        db.commit()
    
    @staticmethod
    def get_monthly_summary(db: Session, user_id: int, month: int, year: int) -> MonthlySummaryResponse:
        if not (1 <= month <= 12) or year < 1900:
            raise ValidationError("Invalid month or year")
        
        transactions = db.query(Transaction).filter(
            Transaction.owner_id == user_id,
            extract("month", Transaction.date) == month,
            extract("year", Transaction.date) == year,
        ).all()
        
        total_income = sum(t.amount for t in transactions if t.type == "income")
        total_expense = sum(t.amount for t in transactions if t.type == "expense")
        balance = total_income - total_expense
        
        return MonthlySummaryResponse(
            month=month,
            year=year,
            total_income=total_income,
            total_expense=total_expense,
            balance=balance
        )