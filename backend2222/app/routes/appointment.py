"""
Appointment routes - CRUD operations for appointments.
Includes double-booking prevention.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..auth import get_current_user, get_current_patient, get_current_doctor
from ..models import User
from ..schemas.appointment import (
    AppointmentCreate,
    AppointmentUpdate,
    AppointmentResponse,
    AppointmentDetailResponse,
    AppointmentCancel
)
from ..services.appointment_service import AppointmentService

router = APIRouter(prefix="/api/appointments", tags=["Appointments"])


@router.post("", response_model=AppointmentResponse, status_code=status.HTTP_201_CREATED)
async def create_appointment(
    appointment_data: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new appointment.
    Double-booking prevention: Prevents scheduling conflicting appointments for the same doctor.
    """
    try:
        appointment = AppointmentService.create_appointment(db, appointment_data)
        return appointment
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/my/appointments", response_model=List[AppointmentResponse])
async def get_my_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_patient)
):
    """Get my appointments as a patient."""
    patient = current_user.patient
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")
    
    appointments = AppointmentService.get_patient_appointments(
        db,
        patient.id,
        status=status,
        skip=skip,
        limit=limit
    )
    return appointments


@router.get("/doctor/schedule", response_model=List[AppointmentResponse])
async def get_doctor_schedule(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_doctor)
):
    """Get my appointments as a doctor."""
    doctor = current_user.doctor
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor profile not found")
    
    appointments = AppointmentService.get_doctor_appointments(
        db,
        doctor.id,
        status=status,
        skip=skip,
        limit=limit
    )
    return appointments


@router.get("", response_model=List[AppointmentResponse])
async def get_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all appointments with optional status filter."""
    appointments = AppointmentService.get_all_appointments(
        db,
        skip=skip,
        limit=limit,
        status=status
    )
    return appointments


@router.get("/{appointment_id}", response_model=AppointmentDetailResponse)
async def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get appointment details by ID."""
    appointment = AppointmentService.get_appointment_by_id(db, appointment_id)
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    return {
        **appointment.__dict__,
        "patient_name": appointment.patient.user.full_name,
        "patient_email": appointment.patient.user.email,
        "doctor_name": appointment.doctor.user.full_name,
        "doctor_specialization": appointment.doctor.specialization,
        "consultation_fee": appointment.doctor.consultation_fee
    }


@router.put("/{appointment_id}", response_model=AppointmentResponse)
async def update_appointment(
    appointment_id: int,
    appointment_data: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update appointment information.
    Double-booking prevention applies when rescheduling.
    """
    appointment = AppointmentService.get_appointment_by_id(db, appointment_id)
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    # Allow patient/doctor of appointment or admin to update
    is_patient = (current_user.patient and current_user.patient.id == appointment.patient_id)
    is_doctor = (current_user.doctor and current_user.doctor.id == appointment.doctor_id)
    is_admin = current_user.role.value == "admin"
    
    if not (is_patient or is_doctor or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    try:
        updated_appointment = AppointmentService.update_appointment(db, appointment_id, appointment_data)
        return updated_appointment
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/{appointment_id}/cancel", response_model=AppointmentResponse)
async def cancel_appointment(
    appointment_id: int,
    cancel_data: AppointmentCancel,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cancel an appointment."""
    appointment = AppointmentService.get_appointment_by_id(db, appointment_id)
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    # Allow patient/doctor of appointment or admin to cancel
    is_patient = (current_user.patient and current_user.patient.id == appointment.patient_id)
    is_doctor = (current_user.doctor and current_user.doctor.id == appointment.doctor_id)
    is_admin = current_user.role.value == "admin"
    
    if not (is_patient or is_doctor or is_admin):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    try:
        cancelled_appointment = AppointmentService.cancel_appointment(
            db,
            appointment_id,
            reason=cancel_data.reason,
            cancelled_by=cancel_data.cancelled_by
        )
        return cancelled_appointment
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{appointment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete an appointment (only scheduled appointments)."""
    appointment = AppointmentService.get_appointment_by_id(db, appointment_id)
    
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
    
    # Only doctors and admins can delete
    if current_user.role.value not in ["doctor", "admin"]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    if not AppointmentService.delete_appointment(db, appointment_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found")
