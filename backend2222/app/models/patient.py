"""
Patient model - Patient-specific information.
"""

from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from ..database import Base


class BloodType(str, enum.Enum):
    """Blood types."""
    O_POSITIVE = "O+"
    O_NEGATIVE = "O-"
    A_POSITIVE = "A+"
    A_NEGATIVE = "A-"
    B_POSITIVE = "B+"
    B_NEGATIVE = "B-"
    AB_POSITIVE = "AB+"
    AB_NEGATIVE = "AB-"


class Patient(Base):
    """
    Patient model - Extends User with patient-specific information.
    """
    __tablename__ = "patients"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Patient demographics
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(20), nullable=True)
    blood_type = Column(String(10), nullable=True)
    height = Column(Integer, nullable=True)  # in cm
    weight = Column(Integer, nullable=True)  # in kg
    
    # Contact and address
    address = Column(Text, nullable=True)
    city = Column(String(100), nullable=True)
    state = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    postal_code = Column(String(20), nullable=True)
    
    # Medical information
    allergies = Column(Text, nullable=True)
    medical_history = Column(Text, nullable=True)
    emergency_contact_name = Column(String(255), nullable=True)
    emergency_contact_phone = Column(String(20), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="patient")
    appointments = relationship("Appointment", foreign_keys="Appointment.patient_id", back_populates="patient", cascade="all, delete-orphan")
    medical_records = relationship("MedicalRecord", back_populates="patient", cascade="all, delete-orphan")
    prescriptions = relationship("Prescription", back_populates="patient", cascade="all, delete-orphan")
    billing_records = relationship("Billing", back_populates="patient", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Patient(id={self.id}, user_id={self.user_id})>"
