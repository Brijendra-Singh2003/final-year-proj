"""
Notification model - System notifications for users.
"""

from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from ..database import Base


class NotificationType(str, enum.Enum):
    """Types of notifications."""
    APPOINTMENT_REMINDER = "appointment_reminder"
    APPOINTMENT_CONFIRMED = "appointment_confirmed"
    APPOINTMENT_CANCELLED = "appointment_cancelled"
    PRESCRIPTION_READY = "prescription_ready"
    TEST_RESULTS = "test_results"
    BILLING_ALERT = "billing_alert"
    ACCOUNT_UPDATE = "account_update"
    SYSTEM_ALERT = "system_alert"
    MESSAGE = "message"


class NotificationChannel(str, enum.Enum):
    """Notification delivery channels."""
    EMAIL = "email"
    SMS = "sms"
    IN_APP = "in_app"
    PUSH = "push"


class Notification(Base):
    """
    Notification model - System notifications for users.
    """
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    
    # Notification content
    notification_type = Column(Enum(NotificationType), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    channel = Column(Enum(NotificationChannel), default=NotificationChannel.IN_APP, nullable=False)
    
    # Related entity (optional)
    related_entity_type = Column(String(50), nullable=True)  # e.g., 'appointment', 'prescription'
    related_entity_id = Column(Integer, nullable=True)
    
    # Status
    is_read = Column(Boolean, default=False, index=True)
    is_sent = Column(Boolean, default=False)
    send_error = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)
    sent_at = Column(DateTime, nullable=True)
    read_at = Column(DateTime, nullable=True)
    scheduled_for = Column(DateTime, nullable=True)  # For scheduled notifications

    # Relationships
    user = relationship("User", foreign_keys=[user_id], back_populates="sent_notifications")

    def __repr__(self):
        return f"<Notification(id={self.id}, user_id={self.user_id}, type={self.notification_type})>"
