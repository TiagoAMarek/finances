from pydantic import BaseModel, Field
from typing import Optional


class BankAccountBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    currency: str = Field(default="BRL", min_length=3, max_length=3)


class BankAccountCreate(BankAccountBase):
    balance: float = Field(default=0.0, ge=0)


class BankAccountUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    balance: Optional[float] = Field(None, ge=0)
    currency: Optional[str] = Field(None, min_length=3, max_length=3)


class BankAccountResponse(BankAccountBase):
    id: int
    balance: float
    owner_id: int
    
    class Config:
        from_attributes = True


class CreditCardBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class CreditCardCreate(CreditCardBase):
    limit: float = Field(..., gt=0)
    current_bill: float = Field(default=0.0, ge=0)


class CreditCardUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    limit: Optional[float] = Field(None, gt=0)
    current_bill: Optional[float] = Field(None, ge=0)


class CreditCardResponse(CreditCardBase):
    id: int
    limit: float
    current_bill: float
    owner_id: int
    
    class Config:
        from_attributes = True