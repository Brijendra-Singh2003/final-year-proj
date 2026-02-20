"""
SQLAlchemy models for Smart Healthcare System.
All models are imported here for easy access and registration with Base.
"""

from .user import User
from .patient import Patient
from .doctor import Doctor
from .appointment import Appointment
from .medical_record import MedicalRecord
from .prescription import Prescription
from .billing import Billing
from .notification import Notification

__all__ = [
    "User",
    "Patient",
    "Doctor",
    "Appointment",
    "MedicalRecord",
    "Prescription",
    "Billing",
    "Notification",
]
