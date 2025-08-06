from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date
from sqlalchemy.orm import relationship
from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    description = Column(String, nullable=False)
    amount = Column(Float, nullable=False)
    type = Column(String, nullable=False)  # 'income' or 'expense'
    date = Column(Date, nullable=False)
    category = Column(String, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("bank_accounts.id"), nullable=True)
    credit_card_id = Column(Integer, ForeignKey("credit_cards.id"), nullable=True)

    owner = relationship("User", back_populates="transactions")
    bank_account = relationship("BankAccount", back_populates="transactions")
    credit_card = relationship("CreditCard", back_populates="transactions")
    
    def __post_init__(self):
        if not (bool(self.account_id) ^ bool(self.credit_card_id)):
            raise ValueError("Transaction must be associated with either an account or credit card, but not both")