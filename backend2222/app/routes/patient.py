"""
Patient routes - CRUD operations for patients.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..auth import get_current_doctor, get_current_admin, get_current_user, get_current_patient
from ..models import User
from ..schemas.patient import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    PatientDetailResponse
)
from ..services.patient_service import PatientService

router = APIRouter(prefix="/api/patients", tags=["Patients"])


@router.post("", response_model=PatientResponse, status_code=status.HTTP_201_CREATED)
async def create_patient(
    patient_data: PatientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new patient. (Admin only)"""
    try:
        patient = PatientService.create_patient(db, patient_data)
        return patient
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/{patient_id}", response_model=PatientDetailResponse)
async def get_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get patient details by ID."""
    patient = PatientService.get_patient_by_id(db, patient_id)
    
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    
    # Return patient with user details
    return {
        **patient.__dict__,
        "email": patient.user.email,
        "username": patient.user.username,
        "full_name": patient.user.full_name,
        "phone": patient.user.phone,
        "is_active": patient.user.is_active
    }


@router.get("", response_model=List[PatientResponse])
async def get_patients(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_doctor)
):
    """Get all patients. (Doctor can view)"""
    patients = PatientService.get_all_patients(db, skip=skip, limit=limit)
    return patients


@router.get("/me", response_model=PatientDetailResponse)
async def get_my_patient(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get current user's patient profile."""
    patient = PatientService.get_patient_by_user_id(db, current_user.id)
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")

    return {
        **patient.__dict__,
        "email": patient.user.email,
        "username": patient.user.username,
        "full_name": patient.user.full_name,
        "phone": patient.user.phone,
        "is_active": patient.user.is_active
    }


@router.put("/{patient_id}", response_model=PatientResponse)
async def update_patient(
    patient_id: int,
    patient_data: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update patient information."""
    # Allow patient to update their own profile or admin to update any
    patient = PatientService.get_patient_by_id(db, patient_id)
    
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
    
    if patient.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    try:
        updated_patient = PatientService.update_patient(db, patient_id, patient_data)
        return updated_patient
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{patient_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete a patient. (Admin only)"""
    if not PatientService.delete_patient(db, patient_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient not found")
