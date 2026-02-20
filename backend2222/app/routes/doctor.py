"""
Doctor routes - CRUD operations for doctors.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..auth import get_current_admin, get_current_user
from ..models import User
from ..schemas.doctor import (
    DoctorCreate,
    DoctorUpdate,
    DoctorResponse,
    DoctorDetailResponse
)
from ..services.doctor_service import DoctorService

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])


@router.post("", response_model=DoctorResponse, status_code=status.HTTP_201_CREATED)
async def create_doctor(
    doctor_data: DoctorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new doctor. (Admin only)"""
    try:
        doctor = DoctorService.create_doctor(db, doctor_data)
        return doctor
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/{doctor_id}", response_model=DoctorDetailResponse)
async def get_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get doctor details by ID."""
    doctor = DoctorService.get_doctor_by_id(db, doctor_id)
    
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    return {
        **doctor.__dict__,
        "email": doctor.user.email,
        "username": doctor.user.username,
        "full_name": doctor.user.full_name,
        "phone": doctor.user.phone,
        "is_active": doctor.user.is_active
    }


@router.get("", response_model=List[DoctorResponse])
async def get_doctors(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    specialization: str = Query(None),
    is_available: bool = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all doctors with optional filters."""
    doctors = DoctorService.get_all_doctors(
        db,
        skip=skip,
        limit=limit,
        specialization=specialization,
        is_available=is_available
    )
    return doctors


@router.put("/{doctor_id}", response_model=DoctorResponse)
async def update_doctor(
    doctor_id: int,
    doctor_data: DoctorUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update doctor information."""
    doctor = DoctorService.get_doctor_by_id(db, doctor_id)
    
    if not doctor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
    
    if doctor.user_id != current_user.id and current_user.role.value != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    try:
        updated_doctor = DoctorService.update_doctor(db, doctor_id, doctor_data)
        return updated_doctor
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_doctor(
    doctor_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete a doctor. (Admin only)"""
    if not DoctorService.delete_doctor(db, doctor_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Doctor not found")
