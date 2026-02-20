"""
Notification service - Business logic for notification operations.
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
import logging

from ..models import Notification, User
from ..schemas.notification import NotificationCreate, NotificationUpdate

logger = logging.getLogger(__name__)


class NotificationService:
    """Service for notification-related operations."""
    
    @staticmethod
    def create_notification(db: Session, notification_data: NotificationCreate) -> Notification:
        """
        Create a new notification.
        
        Args:
            db: Database session
            notification_data: Notification creation data
            
        Returns:
            Created notification
        """
        try:
            # Verify user exists
            user = db.query(User).filter(User.id == notification_data.user_id).first()
            if not user:
                raise ValueError("User not found")
            
            notification = Notification(**notification_data.dict())
            db.add(notification)
            db.commit()
            db.refresh(notification)
            
            logger.info(f"Notification created: {notification.id} for user {notification.user_id}")
            return notification
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating notification: {str(e)}")
            raise
    
    @staticmethod
    def get_notification_by_id(db: Session, notification_id: int) -> Notification:
        """Get notification by ID."""
        return db.query(Notification).filter(Notification.id == notification_id).first()
    
    @staticmethod
    def get_user_notifications(
        db: Session,
        user_id: int,
        unread_only: bool = False,
        skip: int = 0,
        limit: int = 50
    ):
        """
        Get notifications for a user.
        
        Args:
            db: Database session
            user_id: User ID
            unread_only: If True, only return unread notifications
            skip: Number of records to skip
            limit: Maximum records to return
            
        Returns:
            List of notifications
        """
        query = db.query(Notification).filter(Notification.user_id == user_id)
        
        if unread_only:
            query = query.filter(Notification.is_read == False)
        
        return query.order_by(Notification.created_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_unread_count(db: Session, user_id: int) -> int:
        """Get count of unread notifications for a user."""
        return db.query(Notification).filter(
            and_(
                Notification.user_id == user_id,
                Notification.is_read == False
            )
        ).count()
    
    @staticmethod
    def mark_as_read(db: Session, notification_id: int) -> Notification:
        """
        Mark a notification as read.
        
        Args:
            db: Database session
            notification_id: Notification ID
            
        Returns:
            Updated notification
        """
        try:
            notification = db.query(Notification).filter(
                Notification.id == notification_id
            ).first()
            if not notification:
                raise ValueError("Notification not found")
            
            notification.is_read = True
            notification.read_at = datetime.utcnow()
            
            db.commit()
            db.refresh(notification)
            
            logger.info(f"Notification marked as read: {notification.id}")
            return notification
        except Exception as e:
            db.rollback()
            logger.error(f"Error marking notification as read: {str(e)}")
            raise
    
    @staticmethod
    def mark_all_as_read(db: Session, user_id: int) -> int:
        """
        Mark all notifications as read for a user.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            Number of notifications marked as read
        """
        try:
            count = db.query(Notification).filter(
                and_(
                    Notification.user_id == user_id,
                    Notification.is_read == False
                )
            ).update({Notification.is_read: True, Notification.read_at: datetime.utcnow()})
            
            db.commit()
            
            logger.info(f"Marked {count} notifications as read for user {user_id}")
            return count
        except Exception as e:
            db.rollback()
            logger.error(f"Error marking all notifications as read: {str(e)}")
            raise
    
    @staticmethod
    def delete_notification(db: Session, notification_id: int) -> bool:
        """
        Delete a notification.
        
        Args:
            db: Database session
            notification_id: Notification ID
            
        Returns:
            True if deleted, False if not found
        """
        try:
            notification = db.query(Notification).filter(
                Notification.id == notification_id
            ).first()
            if not notification:
                return False
            
            db.delete(notification)
            db.commit()
            
            logger.info(f"Notification deleted: {notification_id}")
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting notification: {str(e)}")
            raise
    
    @staticmethod
    def delete_all_notifications(db: Session, user_id: int) -> int:
        """
        Delete all notifications for a user.
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            Number of notifications deleted
        """
        try:
            count = db.query(Notification).filter(
                Notification.user_id == user_id
            ).delete()
            
            db.commit()
            
            logger.info(f"Deleted {count} notifications for user {user_id}")
            return count
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting notifications: {str(e)}")
            raise
