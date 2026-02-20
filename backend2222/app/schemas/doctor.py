"""
Doctor schemas for request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional


class DoctorBase(BaseModel):
    """Base doctor schema."""
    specialization: str = Field(..., min_length=2, max_length=255)
    license_number: str = Field(..., min_length=3, max_length=100)
    medical_school: Optional[str] = None
    years_of_experience: Optional[int] = Field(None, ge=0)
    office_address: Optional[str] = None
    office_phone: Optional[str] = None
    consultation_fee: Optional[int] = Field(None, ge=0)  # in cents
    bio: Optional[str] = None
    is_available: Optional[str] = "available"


class DoctorCreate(DoctorBase):
    """Doctor creation schema."""
    user_id: int = Field(..., gt=0)


class DoctorUpdate(BaseModel):
    """Doctor update schema."""
    specialization: Optional[str] = Field(None, min_length=2, max_length=255)
    medical_school: Optional[str] = None
    years_of_experience: Optional[int] = Field(None, ge=0)
    office_address: Optional[str] = None
    office_phone: Optional[str] = None
    consultation_fee: Optional[int] = Field(None, ge=0)
    bio: Optional[str] = None
    is_available: Optional[str] = None


class DoctorResponse(DoctorBase):
    """Doctor response schema."""
    id: int
    user_id: int
    average_rating: str
    total_consultations: int
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class DoctorDetailResponse(DoctorResponse):
    """Doctor detail response with user info."""
    email: str
    username: str
    full_name: str
    phone: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True
