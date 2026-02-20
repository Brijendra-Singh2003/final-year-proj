"""
Patient schemas for request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import date


class PatientBase(BaseModel):
    """Base patient schema."""
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    blood_type: Optional[str] = None
    height: Optional[int] = Field(None, gt=0)  # in cm
    weight: Optional[int] = Field(None, gt=0)  # in kg
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    country: Optional[str] = None
    postal_code: Optional[str] = None
    allergies: Optional[str] = None
    medical_history: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None


class PatientCreate(PatientBase):
    """Patient creation schema."""
    user_id: int = Field(..., gt=0)


class PatientUpdate(PatientBase):
    """Patient update schema."""
    pass


class PatientResponse(PatientBase):
    """Patient response schema."""
    id: int
    user_id: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class PatientDetailResponse(PatientResponse):
    """Patient detail response with user info."""
    email: str
    username: str
    full_name: str
    phone: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True
