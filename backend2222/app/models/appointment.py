"""
Appointment model - Appointments between patients and doctors.
"""

from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from ..database import Base


class AppointmentStatus(str, enum.Enum):
    """Appointment status."""
    SCHEDULED = "scheduled"
    IN_PROGRESS = "in_progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    NO_SHOW = "no_show"
    RESCHEDULED = "rescheduled"


class AppointmentType(str, enum.Enum):
    """Type of appointment."""
    CONSULTATION = "consultation"
    FOLLOW_UP = "follow_up"
    EMERGENCY = "emergency"
    ROUTINE_CHECKUP = "routine_checkup"
    PROCEDURE = "procedure"


class Appointment(Base):
    """
    Appointment model - Represents appointments between patients and doctors.
    """
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Appointment details
    appointment_type = Column(Enum(AppointmentType), default=AppointmentType.CONSULTATION, nullable=False)
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.SCHEDULED, nullable=False, index=True)
    scheduled_time = Column(DateTime, nullable=False, index=True)
    duration_minutes = Column(Integer, default=30)  # Duration of appointment
    
    # Appointment information
    reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    diagnosis = Column(Text, nullable=True)
    treatment_plan = Column(Text, nullable=True)
    
    # Cancellation info
    cancellation_reason = Column(Text, nullable=True)
    cancelled_by = Column(String(50), nullable=True)  # 'patient' or 'doctor'
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")
    medical_record = relationship("MedicalRecord", back_populates="appointment", uselist=False)
    billing_record = relationship("Billing", back_populates="appointment", uselist=False)

    def __repr__(self):
        return f"<Appointment(id={self.id}, patient_id={self.patient_id}, doctor_id={self.doctor_id}, status={self.status})>"
