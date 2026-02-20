"""
Appointment schemas for request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class AppointmentBase(BaseModel):
    """Base appointment schema."""
    appointment_type: str = Field(..., min_length=2)
    scheduled_time: datetime
    duration_minutes: int = Field(default=30, ge=15, le=480)
    reason: Optional[str] = None
    notes: Optional[str] = None


class AppointmentCreate(AppointmentBase):
    """Appointment creation schema."""
    patient_id: int = Field(..., gt=0)
    doctor_id: int = Field(..., gt=0)


class AppointmentUpdate(BaseModel):
    """Appointment update schema."""
    scheduled_time: Optional[datetime] = None
    duration_minutes: Optional[int] = Field(None, ge=15, le=480)
    reason: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None
    diagnosis: Optional[str] = None
    treatment_plan: Optional[str] = None


class AppointmentResponse(AppointmentBase):
    """Appointment response schema."""
    id: int
    patient_id: int
    doctor_id: int
    status: str
    diagnosis: Optional[str]
    treatment_plan: Optional[str]
    created_at: str
    updated_at: str

    class Config:
        from_attributes = True


class AppointmentDetailResponse(AppointmentResponse):
    """Appointment detail response with patient/doctor info."""
    patient_name: str
    patient_email: str
    doctor_name: str
    doctor_specialization: str
    consultation_fee: Optional[int]

    class Config:
        from_attributes = True


class AppointmentCancel(BaseModel):
    """Appointment cancellation schema."""
    reason: Optional[str] = None
    cancelled_by: str = Field(..., pattern="^(patient|doctor)$")
