from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
from datetime import date


class TransactionBase(BaseModel):
    description: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0)
    type: Literal["income", "expense", "transfer"]
    date: date
    category: str = Field(..., min_length=1, max_length=50)


class TransactionCreate(TransactionBase):
    account_id: Optional[int] = None
    credit_card_id: Optional[int] = None
    to_account_id: Optional[int] = None
    
    @validator("account_id")
    def validate_transaction_type(cls, v, values):
        transaction_type = values.get("type")
        credit_card_id = values.get("credit_card_id")
        to_account_id = values.get("to_account_id")
        
        if transaction_type == "transfer":
            if not (v and to_account_id):
                raise ValueError("Transfer must have both account_id and to_account_id")
            if credit_card_id:
                raise ValueError("Transfers cannot involve credit cards")
            if v == to_account_id:
                raise ValueError("Cannot transfer to the same account")
        else:
            if to_account_id:
                raise ValueError("to_account_id is only valid for transfers")
            if not (bool(v) ^ bool(credit_card_id)):
                raise ValueError("Must specify either account_id or credit_card_id, but not both")
        return v


class TransactionUpdate(BaseModel):
    description: Optional[str] = Field(None, min_length=1, max_length=200)
    amount: Optional[float] = Field(None, gt=0)
    type: Optional[Literal["income", "expense", "transfer"]] = None
    date: Optional[date] = None
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    account_id: Optional[int] = None
    credit_card_id: Optional[int] = None
    to_account_id: Optional[int] = None


class TransactionResponse(TransactionBase):
    id: int
    owner_id: int
    account_id: Optional[int]
    credit_card_id: Optional[int]
    to_account_id: Optional[int]
    
    class Config:
        from_attributes = True


class TransferCreate(BaseModel):
    description: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0)
    date: date
    from_account_id: int
    to_account_id: int
    
    @validator("to_account_id")
    def validate_different_accounts(cls, v, values):
        from_account_id = values.get("from_account_id")
        if v == from_account_id:
            raise ValueError("Cannot transfer to the same account")
        return v


class MonthlySummaryResponse(BaseModel):
    month: int
    year: int
    total_income: float
    total_expense: float
    balance: float