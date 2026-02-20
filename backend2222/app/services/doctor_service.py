"""
Doctor service - Business logic for doctor operations.
"""

from sqlalchemy.orm import Session
from datetime import datetime
import logging

from ..models import Doctor, User
from ..schemas.doctor import DoctorCreate, DoctorUpdate

logger = logging.getLogger(__name__)


class DoctorService:
    """Service for doctor-related operations."""
    
    @staticmethod
    def create_doctor(db: Session, doctor_data: DoctorCreate) -> Doctor:
        """
        Create a new doctor.
        
        Args:
            db: Database session
            doctor_data: Doctor creation data
            
        Returns:
            Created doctor
        """
        try:
            # Verify user exists
            user = db.query(User).filter(User.id == doctor_data.user_id).first()
            if not user:
                raise ValueError("User not found")
            
            # Check if doctor already exists for this user
            existing_doctor = db.query(Doctor).filter(
                Doctor.user_id == doctor_data.user_id
            ).first()
            if existing_doctor:
                raise ValueError("Doctor profile already exists for this user")
            
            # Check license uniqueness
            existing_license = db.query(Doctor).filter(
                Doctor.license_number == doctor_data.license_number
            ).first()
            if existing_license:
                raise ValueError("License number already registered")
            
            doctor = Doctor(**doctor_data.dict())
            db.add(doctor)
            db.commit()
            db.refresh(doctor)
            
            logger.info(f"Doctor created: {doctor.id} for user {doctor.user_id}")
            return doctor
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating doctor: {str(e)}")
            raise
    
    @staticmethod
    def get_doctor_by_id(db: Session, doctor_id: int) -> Doctor:
        """Get doctor by ID."""
        return db.query(Doctor).filter(Doctor.id == doctor_id).first()
    
    @staticmethod
    def get_doctor_by_user_id(db: Session, user_id: int) -> Doctor:
        """Get doctor by user ID."""
        return db.query(Doctor).filter(Doctor.user_id == user_id).first()
    
    @staticmethod
    def get_all_doctors(
        db: Session,
        skip: int = 0,
        limit: int = 50,
        specialization: str = None,
        is_available: bool = None
    ):
        """
        Get all doctors with optional filters.
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum records to return
            specialization: Filter by specialization
            is_available: Filter by availability
            
        Returns:
            List of doctors
        """
        query = db.query(Doctor)
        
        if specialization:
            query = query.filter(Doctor.specialization == specialization)
        
        if is_available is not None:
            query = query.filter(Doctor.is_available == ("available" if is_available else "unavailable"))
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def update_doctor(
        db: Session,
        doctor_id: int,
        doctor_data: DoctorUpdate
    ) -> Doctor:
        """
        Update doctor information.
        
        Args:
            db: Database session
            doctor_id: Doctor ID
            doctor_data: Update data
            
        Returns:
            Updated doctor
        """
        try:
            doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
            if not doctor:
                raise ValueError("Doctor not found")
            
            update_data = doctor_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(doctor, key, value)
            
            doctor.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(doctor)
            
            logger.info(f"Doctor updated: {doctor.id}")
            return doctor
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating doctor: {str(e)}")
            raise
    
    @staticmethod
    def delete_doctor(db: Session, doctor_id: int) -> bool:
        """
        Delete a doctor.
        
        Args:
            db: Database session
            doctor_id: Doctor ID
            
        Returns:
            True if deleted, False if not found
        """
        try:
            doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
            if not doctor:
                return False
            
            db.delete(doctor)
            db.commit()
            
            logger.info(f"Doctor deleted: {doctor_id}")
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting doctor: {str(e)}")
            raise
