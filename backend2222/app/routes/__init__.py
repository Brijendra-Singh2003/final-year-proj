"""
Routes module - API endpoints.
"""

from .auth import router as auth_router
from .patient import router as patient_router
from .doctor import router as doctor_router
from .appointment import router as appointment_router
from .billing import router as billing_router
from .notification import router as notification_router
from .medical_record import router as medical_record_router

__all__ = [
    "auth_router",
    "patient_router",
    "doctor_router",
    "appointment_router",
    "billing_router",
    "notification_router"
    "medical_record_router"
]
