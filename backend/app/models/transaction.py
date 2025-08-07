from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False)  # 'income', 'expense', or 'transfer'
    date = Column(Date, nullable=False)
    category = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("bank_accounts.id"), nullable=True)
    credit_card_id = Column(Integer, ForeignKey("credit_cards.id"), nullable=True)
    
    # For transfers: destination account
    to_account_id = Column(Integer, ForeignKey("bank_accounts.id"), nullable=True)

    owner = relationship("User", back_populates="transactions")
    bank_account = relationship("BankAccount", back_populates="transactions", foreign_keys=[account_id])
    credit_card = relationship("CreditCard", back_populates="transactions")
    to_account = relationship("BankAccount", foreign_keys=[to_account_id])
    
    def __post_init__(self):
        if self.type == 'transfer':
            if not (self.account_id and self.to_account_id):
                raise ValueError("Transfer must have both source and destination accounts")
            if self.account_id == self.to_account_id:
                raise ValueError("Cannot transfer to the same account")
        else:
            if not (bool(self.account_id) ^ bool(self.credit_card_id)):
                raise ValueError("Transaction must be associated with either an account or credit card, but not both")