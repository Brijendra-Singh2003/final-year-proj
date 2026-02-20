from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import RoleEnum, AppointmentStatus


# ─── Auth ────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: RoleEnum = RoleEnum.patient
    specialty: Optional[str] = None
    phone: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str
    role: RoleEnum
    specialty: Optional[str] = None
    phone: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ─── Appointments ────────────────────────────────────────────────────────────

class AppointmentCreate(BaseModel):
    doctor_id: int
    date: str          # "YYYY-MM-DD"
    time_slot: str     # "09:00 AM"
    notes: Optional[str] = None


class AppointmentOut(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    date: str
    time_slot: str
    status: AppointmentStatus
    notes: Optional[str] = None
    created_at: datetime
    patient: Optional[UserOut] = None
    doctor: Optional[UserOut] = None

    class Config:
        from_attributes = True


# ─── Medical Records ─────────────────────────────────────────────────────────

class ReportCreate(BaseModel):
    content: str
    diagnosis: Optional[str] = None
    prescription: Optional[str] = None


class ReportOut(BaseModel):
    id: int
    record_id: int
    doctor_id: int
    content: str
    diagnosis: Optional[str] = None
    prescription: Optional[str] = None
    created_at: datetime
    doctor: Optional[UserOut] = None

    class Config:
        from_attributes = True


class MedicalRecordOut(BaseModel):
    id: int
    patient_id: int
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    reports: List[ReportOut] = []

    class Config:
        from_attributes = True


class MedicalRecordCreate(BaseModel):
    summary: Optional[str] = None
