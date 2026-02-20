"""
Doctor model - Doctor-specific information and specialization.
"""

from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from ..database import Base


class Doctor(Base):
    """
    Doctor model - Extends User with doctor-specific information.
    """
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    # Professional information
    specialization = Column(String(255), nullable=False, index=True)
    license_number = Column(String(100), unique=True, nullable=False)
    medical_school = Column(String(255), nullable=True)
    years_of_experience = Column(Integer, nullable=True)
    
    # Contact and office
    office_address = Column(Text, nullable=True)
    office_phone = Column(String(20), nullable=True)
    consultation_fee = Column(Integer, nullable=True)  # in cents/smallest currency unit
    bio = Column(Text, nullable=True)
    
    # Availability and ratings
    is_available = Column(String(20), default="available")  # available, unavailable, on_leave
    average_rating = Column(String(4), default="0.0", nullable=True)  # e.g., "4.5"
    total_consultations = Column(Integer, default=0)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="doctor")
    appointments = relationship("Appointment", foreign_keys="Appointment.doctor_id", back_populates="doctor", cascade="all, delete-orphan")
    prescriptions = relationship("Prescription", back_populates="doctor", cascade="all, delete-orphan")
    medical_records = relationship("MedicalRecord", back_populates="doctor", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Doctor(id={self.id}, specialization={self.specialization})>"
