"""
Notification schemas for request/response validation.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class NotificationBase(BaseModel):
    """Base notification schema."""
    notification_type: str
    title: str = Field(..., min_length=1, max_length=255)
    message: str = Field(..., min_length=1)
    channel: str = Field(default="in_app")


class NotificationCreate(NotificationBase):
    """Notification creation schema."""
    user_id: int = Field(..., gt=0)
    related_entity_type: Optional[str] = None
    related_entity_id: Optional[int] = None
    scheduled_for: Optional[datetime] = None


class NotificationUpdate(BaseModel):
    """Notification update schema."""
    is_read: Optional[bool] = None


class NotificationResponse(NotificationBase):
    """Notification response schema."""
    id: int
    user_id: int
    is_read: bool
    is_sent: bool
    related_entity_type: Optional[str]
    related_entity_id: Optional[int]
    created_at: str
    sent_at: Optional[str]
    read_at: Optional[str]

    class Config:
        from_attributes = True


class NotificationMarkAsRead(BaseModel):
    """Mark notification as read schema."""
    is_read: bool = True
