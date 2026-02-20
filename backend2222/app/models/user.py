"""
User model - Base user entity for authentication and authorization.
"""

from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from ..database import Base


class UserRole(str, enum.Enum):
    """User roles in the system."""
    ADMIN = "admin"
    DOCTOR = "doctor"
    PATIENT = "patient"
    STAFF = "staff"


class User(Base):
    """
    User model - Base entity for all users in the system.
    """
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    phone = Column(String(20), nullable=True)
    
    # User status and role
    role = Column(Enum(UserRole), default=UserRole.PATIENT, nullable=False)
    is_active = Column(Boolean, default=True, index=True)
    is_verified = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    patient = relationship("Patient", uselist=False, back_populates="user", cascade="all, delete-orphan")
    doctor = relationship("Doctor", uselist=False, back_populates="user", cascade="all, delete-orphan")
    sent_notifications = relationship("Notification", foreign_keys="Notification.user_id", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, email={self.email}, username={self.username}, role={self.role})>"
