"""
Billing schemas for request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class BillingBase(BaseModel):
    """Base billing schema."""
    description: Optional[str] = None
    consultation_fee: int = Field(default=0, ge=0)
    test_fees: int = Field(default=0, ge=0)
    procedure_fees: int = Field(default=0, ge=0)
    medication_fees: int = Field(default=0, ge=0)
    discount: int = Field(default=0, ge=0)
    tax: int = Field(default=0, ge=0)
    due_date: Optional[datetime] = None
    notes: Optional[str] = None


class BillingCreate(BillingBase):
    """Billing creation schema."""
    patient_id: int = Field(..., gt=0)
    appointment_id: Optional[int] = None


class BillingUpdate(BaseModel):
    """Billing update schema."""
    description: Optional[str] = None
    amount_paid: Optional[int] = Field(None, ge=0)
    status: Optional[str] = None
    payment_method: Optional[str] = None
    notes: Optional[str] = None


class BillingResponse(BillingBase):
    """Billing response schema."""
    id: int
    patient_id: int
    appointment_id: Optional[int]
    invoice_number: str
    total_amount: int
    amount_paid: int
    amount_due: int
    status: str
    payment_method: Optional[str]
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class BillingDetailResponse(BillingResponse):
    """Billing detail response with patient info."""
    patient_name: str
    patient_email: str

    class Config:
        from_attributes = True
