"""
Prescription model - Medication prescriptions for patients.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from ..database import Base


class PrescriptionStatus(str, enum.Enum):
    """Prescription status."""
    ACTIVE = "active"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    EXPIRED = "expired"


class Prescription(Base):
    """
    Prescription model - Medication prescriptions issued by doctors.
    """
    __tablename__ = "prescriptions"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="SET NULL"), nullable=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True)
    
    # Medication information
    medication_name = Column(String(255), nullable=False)
    dosage = Column(String(100), nullable=False)  # e.g., "500mg", "10mg/mL"
    frequency = Column(String(100), nullable=False)  # e.g., "Twice daily", "Every 8 hours"
    duration_days = Column(Integer, nullable=False)  # Duration of prescription
    quantity = Column(Integer, nullable=False)
    
    # Additional information
    instructions = Column(Text, nullable=True)
    side_effects = Column(Text, nullable=True)
    warnings = Column(Text, nullable=True)
    
    # Status tracking
    status = Column(Enum(PrescriptionStatus), default=PrescriptionStatus.ACTIVE, nullable=False, index=True)
    refills_allowed = Column(Integer, default=0)
    refills_used = Column(Integer, default=0)
    
    # Timestamps
    issued_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    start_date = Column(DateTime, nullable=True)
    end_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="prescriptions")
    doctor = relationship("Doctor", back_populates="prescriptions")
    appointment = relationship("Appointment", foreign_keys=[appointment_id])

    def __repr__(self):
        return f"<Prescription(id={self.id}, patient_id={self.patient_id}, medication_name={self.medication_name})>"
