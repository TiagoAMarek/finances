from pydantic import BaseModel, Field, validator
from typing import Optional, Literal
from datetime import date


class TransactionBase(BaseModel):
    description: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0)
    type: Literal["income", "expense"]
    date: date
    category: str = Field(..., min_length=1, max_length=50)


class TransactionCreate(TransactionBase):
    account_id: Optional[int] = None
    credit_card_id: Optional[int] = None
    
    @validator("account_id")
    def validate_account_or_card(cls, v, values):
        credit_card_id = values.get("credit_card_id")
        if not (bool(v) ^ bool(credit_card_id)):
            raise ValueError("Must specify either account_id or credit_card_id, but not both")
        return v


class TransactionUpdate(BaseModel):
    description: Optional[str] = Field(None, min_length=1, max_length=200)
    amount: Optional[float] = Field(None, gt=0)
    type: Optional[Literal["income", "expense"]] = None
    date: Optional[date] = None
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    account_id: Optional[int] = None
    credit_card_id: Optional[int] = None


class TransactionResponse(TransactionBase):
    id: int
    owner_id: int
    account_id: Optional[int]
    credit_card_id: Optional[int]
    
    class Config:
        from_attributes = True


class MonthlySummaryResponse(BaseModel):
    month: int
    year: int
    total_income: float
    total_expense: float
    balance: float