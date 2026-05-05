import re
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional, List
from datetime import datetime
from models import RoleEnum, AppointmentStatus, LabUploadAssignmentStatus

_DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
_TIME_RE = re.compile(r"^(0[1-9]|1[0-2]):[0-5]\d (AM|PM)$")

# Roles that cannot be self-registered
_RESTRICTED_ROLES = {RoleEnum.admin, RoleEnum.lab}


# ─── Auth ────────────────────────────────────────────────────────────────────

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: RoleEnum = RoleEnum.patient
    specialty: Optional[str] = None
    phone: Optional[str] = None

    @field_validator("role")
    @classmethod
    def role_not_restricted(cls, v: RoleEnum) -> RoleEnum:
        if v in _RESTRICTED_ROLES:
            raise ValueError("Cannot self-register with this role")
        return v

    @field_validator("password")
    @classmethod
    def password_strength(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


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

    @field_validator("date")
    @classmethod
    def validate_date(cls, v: str) -> str:
        if not _DATE_RE.match(v):
            raise ValueError("date must be in YYYY-MM-DD format")
        try:
            datetime.strptime(v, "%Y-%m-%d")
        except ValueError:
            raise ValueError("date is not a valid calendar date")
        return v

    @field_validator("time_slot")
    @classmethod
    def validate_time_slot(cls, v: str) -> str:
        if not _TIME_RE.match(v):
            raise ValueError("time_slot must be in HH:MM AM/PM format, e.g. 09:00 AM")
        return v


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


# ─── Lab Upload Assignments & Test Result Files ───────────────────────────────

class LabUploadAssignmentCreate(BaseModel):
    lab_user_id: int
    expires_at: Optional[datetime] = None


class LabUploadAssignmentOut(BaseModel):
    id: int
    record_id: int
    patient_id: int
    doctor_id: int
    lab_user_id: int
    status: LabUploadAssignmentStatus
    created_at: datetime
    expires_at: Optional[datetime] = None
    consumed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TestResultFileOut(BaseModel):
    id: int
    assignment_id: int
    record_id: int
    patient_id: int
    uploaded_by_user_id: int
    original_filename: str
    content_type: Optional[str] = None
    size_bytes: int
    hash_algo: str
    hash_hex: str
    created_at: datetime

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
    appointment_id: Optional[int] = None
    summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    reports: List[ReportOut] = []
    test_result_files: List[TestResultFileOut] = []

    class Config:
        from_attributes = True


class MedicalRecordCreate(BaseModel):
    summary: Optional[str] = None
