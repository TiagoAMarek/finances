from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base


class BankAccount(Base):
    __tablename__ = "bank_accounts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    balance = Column(Float, default=0.0, nullable=False)
    currency = Column(String, default="BRL", nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="accounts")
    transactions = relationship("Transaction", back_populates="bank_account", foreign_keys="[Transaction.account_id]")


class CreditCard(Base):
    __tablename__ = "credit_cards"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    limit = Column(Float, default=0.0, nullable=False)
    current_bill = Column(Float, default=0.0, nullable=False)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="credit_cards")
    transactions = relationship("Transaction", back_populates="credit_card")