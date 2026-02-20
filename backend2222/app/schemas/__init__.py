"""
Schemas module - Pydantic schemas for request/response validation.
"""

from .auth import (
    TokenResponse,
    UserBase,
    UserRegister,
    UserLogin,
    UserResponse,
    LoginResponse,
    RefreshTokenRequest,
    PasswordChange,
    PasswordReset,
    PasswordResetConfirm
)
from .patient import (
    PatientBase,
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    PatientDetailResponse
)
from .doctor import (
    DoctorBase,
    DoctorCreate,
    DoctorUpdate,
    DoctorResponse,
    DoctorDetailResponse
)
from .appointment import (
    AppointmentBase,
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
    AppointmentDetailResponse,
    AppointmentCancel
)
from .billing import (
    BillingBase,
    BillingCreate,
    BillingUpdate,
    BillingResponse,
    BillingDetailResponse
)
from .notification import (
    NotificationBase,
    NotificationCreate,
    NotificationUpdate,
    NotificationResponse,
    NotificationMarkAsRead
)

__all__ = [
    "TokenResponse",
    "UserBase",
    "UserRegister",
    "UserLogin",
    "UserResponse",
    "LoginResponse",
    "RefreshTokenRequest",
    "PasswordChange",
    "PasswordReset",
    "PasswordResetConfirm",
    "PatientBase",
    "PatientCreate",
    "PatientUpdate",
    "PatientResponse",
    "PatientDetailResponse",
    "DoctorBase",
    "DoctorCreate",
    "DoctorUpdate",
    "DoctorResponse",
    "DoctorDetailResponse",
    "AppointmentBase",
    "AppointmentCreate",
    "AppointmentUpdate",
    "AppointmentResponse",
    "AppointmentDetailResponse",
    "AppointmentCancel",
    "BillingBase",
    "BillingCreate",
    "BillingUpdate",
    "BillingResponse",
    "BillingDetailResponse",
    "NotificationBase",
    "NotificationCreate",
    "NotificationUpdate",
    "NotificationResponse",
    "NotificationMarkAsRead"
]
