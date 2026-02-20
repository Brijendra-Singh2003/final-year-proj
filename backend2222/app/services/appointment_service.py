"""
Appointment service - Business logic for appointment operations.
Includes double-booking prevention.
"""

from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime, timedelta
import logging

from ..models import Appointment, Patient, Doctor, Billing
from ..models.appointment import AppointmentStatus
from ..schemas.appointment import AppointmentCreate, AppointmentUpdate

logger = logging.getLogger(__name__)


class AppointmentService:
    """Service for appointment-related operations."""
    
    @staticmethod
    def _check_double_booking(
        db: Session,
        doctor_id: int,
        scheduled_time: datetime,
        duration_minutes: int,
        exclude_appointment_id: int = None
    ) -> bool:
        """
        Check if doctor has conflicting appointments.
        
        Args:
            db: Database session
            doctor_id: Doctor ID
            scheduled_time: Appointment start time
            duration_minutes: Appointment duration
            exclude_appointment_id: Appointment ID to exclude from check
            
        Returns:
            True if conflict exists, False otherwise
        """
        appointment_end = scheduled_time + timedelta(minutes=duration_minutes)
        
        # Query for overlapping appointments
        query = db.query(Appointment).filter(
            and_(
                Appointment.doctor_id == doctor_id,
                Appointment.status.in_([
                    AppointmentStatus.SCHEDULED,
                    AppointmentStatus.IN_PROGRESS
                ]),
                # Check for time overlap
                or_(
                    # Appointment starts during existing appointment
                    and_(
                        Appointment.scheduled_time <= scheduled_time,
                        Appointment.scheduled_time + timedelta(minutes=Appointment.duration_minutes) > scheduled_time
                    ),
                    # Appointment ends during existing appointment
                    and_(
                        Appointment.scheduled_time < appointment_end,
                        Appointment.scheduled_time + timedelta(minutes=Appointment.duration_minutes) >= appointment_end
                    ),
                    # New appointment completely contains existing appointment
                    and_(
                        Appointment.scheduled_time >= scheduled_time,
                        Appointment.scheduled_time + timedelta(minutes=Appointment.duration_minutes) <= appointment_end
                    )
                )
            )
        )
        
        # Exclude current appointment if updating
        if exclude_appointment_id:
            query = query.filter(Appointment.id != exclude_appointment_id)
        
        return query.first() is not None
    
    @staticmethod
    def create_appointment(db: Session, appointment_data: AppointmentCreate) -> Appointment:
        """
        Create a new appointment with double-booking prevention.
        
        Args:
            db: Database session
            appointment_data: Appointment creation data
            
        Returns:
            Created appointment
            
        Raises:
            ValueError: If validation fails
        """
        try:
            # Verify patient exists
            patient = db.query(Patient).filter(Patient.id == appointment_data.patient_id).first()
            if not patient:
                raise ValueError("Patient not found")
            
            # Verify doctor exists
            doctor = db.query(Doctor).filter(Doctor.id == appointment_data.doctor_id).first()
            if not doctor:
                raise ValueError("Doctor not found")
            
            # Check if appointment time is in the future
            if appointment_data.scheduled_time < datetime.utcnow():
                raise ValueError("Appointment time must be in the future")
            
            # Check for double booking
            if AppointmentService._check_double_booking(
                db,
                appointment_data.doctor_id,
                appointment_data.scheduled_time,
                appointment_data.duration_minutes
            ):
                raise ValueError("Doctor has a conflicting appointment at this time")
            
            appointment = Appointment(**appointment_data.dict())
            db.add(appointment)
            db.commit()
            db.refresh(appointment)
            
            logger.info(f"Appointment created: {appointment.id}")
            return appointment
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating appointment: {str(e)}")
            raise
    
    @staticmethod
    def get_appointment_by_id(db: Session, appointment_id: int) -> Appointment:
        """Get appointment by ID."""
        return db.query(Appointment).filter(Appointment.id == appointment_id).first()
    
    @staticmethod
    def get_patient_appointments(
        db: Session,
        patient_id: int,
        status: str = None,
        skip: int = 0,
        limit: int = 50
    ):
        """Get appointments for a patient."""
        query = db.query(Appointment).filter(Appointment.patient_id == patient_id)
        
        if status:
            query = query.filter(Appointment.status == status)
        
        return query.order_by(Appointment.scheduled_time.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_doctor_appointments(
        db: Session,
        doctor_id: int,
        status: str = None,
        skip: int = 0,
        limit: int = 50
    ):
        """Get appointments for a doctor."""
        query = db.query(Appointment).filter(Appointment.doctor_id == doctor_id)
        
        if status:
            query = query.filter(Appointment.status == status)
        
        return query.order_by(Appointment.scheduled_time.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_all_appointments(
        db: Session,
        skip: int = 0,
        limit: int = 50,
        status: str = None
    ):
        """Get all appointments with optional status filter."""
        query = db.query(Appointment)
        
        if status:
            query = query.filter(Appointment.status == status)
        
        return query.order_by(Appointment.scheduled_time.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_appointment(
        db: Session,
        appointment_id: int,
        appointment_data: AppointmentUpdate
    ) -> Appointment:
        """
        Update appointment information.
        Prevents double-booking when rescheduling.
        
        Args:
            db: Database session
            appointment_id: Appointment ID
            appointment_data: Update data
            
        Returns:
            Updated appointment
        """
        try:
            appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
            if not appointment:
                raise ValueError("Appointment not found")
            
            # Check for double booking if rescheduling
            if appointment_data.scheduled_time:
                duration = appointment_data.duration_minutes or appointment.duration_minutes
                
                if AppointmentService._check_double_booking(
                    db,
                    appointment.doctor_id,
                    appointment_data.scheduled_time,
                    duration,
                    exclude_appointment_id=appointment_id
                ):
                    raise ValueError("Doctor has a conflicting appointment at this time")
            
            update_data = appointment_data.dict(exclude_unset=True)
            for key, value in update_data.items():
                setattr(appointment, key, value)
            
            appointment.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(appointment)
            
            logger.info(f"Appointment updated: {appointment.id}")
            return appointment
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating appointment: {str(e)}")
            raise
    
    @staticmethod
    def cancel_appointment(
        db: Session,
        appointment_id: int,
        reason: str = None,
        cancelled_by: str = None
    ) -> Appointment:
        """
        Cancel an appointment.
        
        Args:
            db: Database session
            appointment_id: Appointment ID
            reason: Cancellation reason
            cancelled_by: Who cancelled ('patient' or 'doctor')
            
        Returns:
            Cancelled appointment
        """
        try:
            appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
            if not appointment:
                raise ValueError("Appointment not found")
            
            appointment.status = AppointmentStatus.CANCELLED
            appointment.cancellation_reason = reason
            appointment.cancelled_by = cancelled_by
            appointment.updated_at = datetime.utcnow()
            
            db.commit()
            db.refresh(appointment)
            
            logger.info(f"Appointment cancelled: {appointment.id} by {cancelled_by}")
            return appointment
        except Exception as e:
            db.rollback()
            logger.error(f"Error cancelling appointment: {str(e)}")
            raise
    
    @staticmethod
    def delete_appointment(db: Session, appointment_id: int) -> bool:
        """
        Delete an appointment.
        
        Args:
            db: Database session
            appointment_id: Appointment ID
            
        Returns:
            True if deleted, False if not found
        """
        try:
            appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
            if not appointment:
                return False
            
            db.delete(appointment)
            db.commit()
            
            logger.info(f"Appointment deleted: {appointment_id}")
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting appointment: {str(e)}")
            raise
