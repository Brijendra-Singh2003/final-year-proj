"""
MedicalRecord model - Patient medical records and health information.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class MedicalRecord(Base):
    """
    MedicalRecord model - Stores medical records for patients.
    """
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id", ondelete="SET NULL"), nullable=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True)
    
    # Record information
    record_type = Column(String(100), nullable=False)  # e.g., 'Lab Report', 'X-Ray', 'Diagnosis'
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    
    # Medical details
    vital_signs = Column(Text, nullable=True)  # JSON or text format for BP, HR, etc.
    symptoms = Column(Text, nullable=True)
    test_results = Column(Text, nullable=True)
    diagnosis = Column(Text, nullable=True)
    treatment_notes = Column(Text, nullable=True)
    
    # File attachment info
    file_url = Column(String(500), nullable=True)
    file_name = Column(String(255), nullable=True)
    
    # Timestamps
    recorded_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="medical_records")
    doctor = relationship("Doctor", back_populates="medical_records")
    appointment = relationship("Appointment", back_populates="medical_record")

    def __repr__(self):
        return f"<MedicalRecord(id={self.id}, patient_id={self.patient_id}, record_type={self.record_type})>"
