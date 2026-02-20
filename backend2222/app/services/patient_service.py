"""
Patient service - Business logic for patient operations.
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import datetime
import logging

from ..models import Patient, User
from ..schemas.patient import PatientCreate, PatientUpdate

logger = logging.getLogger(__name__)


class PatientService:
    """Service for patient-related operations."""
    
    @staticmethod
    def create_patient(db: Session, patient_data: PatientCreate) -> Patient:
        """
        Create a new patient.
        
        Args:
            db: Database session
            patient_data: Patient creation data
            
        Returns:
            Created patient
        """
        try:
            # Verify user exists and is patient
            user = db.query(User).filter(User.id == patient_data.user_id).first()
            if not user:
                raise ValueError("User not found")
            
            # Check if patient already exists for this user
            existing_patient = db.query(Patient).filter(
                Patient.user_id == patient_data.user_id
            ).first()
            if existing_patient:
                raise ValueError("Patient profile already exists for this user")
            
            patient = Patient(**patient_data.dict())
            db.add(patient)
            db.commit()
            db.refresh(patient)
            
            logger.info(f"Patient created: {patient.id} for user {patient.user_id}")
            return patient
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating patient: {str(e)}")
            raise
    
    @staticmethod
    def get_patient_by_id(db: Session, patient_id: int) -> Patient:
        """Get patient by ID."""
        return db.query(Patient).filter(Patient.id == patient_id).first()
    
    @staticmethod
    def get_patient_by_user_id(db: Session, user_id: int) -> Patient:
        """Get patient by user ID."""
        return db.query(Patient).filter(Patient.user_id == user_id).first()
    
    @staticmethod
    def get_all_patients(db: Session, skip: int = 0, limit: int = 50):
        """Get all patients with pagination."""
        return db.query(Patient).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_patient(
        db: Session,
        patient_id: int,
        patient_data: PatientUpdate
    ) -> Patient:
        """
        Update patient information.
        
        Args:
            db: Database session
            patient_id: Patient ID
            patient_data: Update data
            
        Returns:
            Updated patient
        """
        try:
            patient = db.query(Patient).filter(Patient.id == patient_id).first()
            if not patient:
                raise ValueError("Patient not found")
            
            update_data = patient_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(patient, key, value)
            
            patient.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(patient)
            
            logger.info(f"Patient updated: {patient.id}")
            return patient
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating patient: {str(e)}")
            raise
    
    @staticmethod
    def delete_patient(db: Session, patient_id: int) -> bool:
        """
        Delete a patient.
        
        Args:
            db: Database session
            patient_id: Patient ID
            
        Returns:
            True if deleted, False if not found
        """
        try:
            patient = db.query(Patient).filter(Patient.id == patient_id).first()
            if not patient:
                return False
            
            db.delete(patient)
            db.commit()
            
            logger.info(f"Patient deleted: {patient_id}")
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting patient: {str(e)}")
            raise
