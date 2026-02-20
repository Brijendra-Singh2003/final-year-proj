"""
Medical record routes - upload and list patient's medical records.
"""

import os
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from pathlib import Path

from ..database import get_db
from ..auth import get_current_patient, get_current_user
from ..models import MedicalRecord, Patient
from ..services.patient_service import PatientService

router = APIRouter(prefix="/api/medical_records", tags=["MedicalRecords"])

UPLOAD_DIR = Path("uploads/medical_records")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


@router.post("", status_code=status.HTTP_201_CREATED)
async def upload_medical_record(
    file: UploadFile = File(...),
    record_type: str = Form(...),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    appointment_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
    current_user = Depends(get_current_patient),
):
    """Upload a medical record file and create a MedicalRecord entry for the current patient."""
    patient = current_user.patient
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")

    # Save file to disk
    filename = f"{patient.id}_{int(__import__('time').time())}_{file.filename}"
    dest = UPLOAD_DIR / filename
    try:
        with open(dest, "wb") as f:
            content = await file.read()
            f.write(content)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

    # Create MedicalRecord
    mr = MedicalRecord(
        patient_id=patient.id,
        doctor_id=None,
        appointment_id=appointment_id,
        record_type=record_type,
        title=title,
        description=description,
        file_url=str(dest.as_posix()),
        file_name=file.filename,
    )
    db.add(mr)
    db.commit()
    db.refresh(mr)

    return {
        "id": mr.id,
        "patient_id": mr.patient_id,
        "record_type": mr.record_type,
        "title": mr.title,
        "description": mr.description,
        "file_url": mr.file_url,
        "file_name": mr.file_name,
        "recorded_date": mr.recorded_date.isoformat(),
    }


@router.get("", response_model=List[dict])
async def list_my_records(db: Session = Depends(get_db), current_user = Depends(get_current_patient)):
    patient = current_user.patient
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")

    records = db.query(MedicalRecord).filter(MedicalRecord.patient_id == patient.id).all()
    return [
        {
            "id": r.id,
            "title": r.title,
            "record_type": r.record_type,
            "file_name": r.file_name,
            "file_url": r.file_url,
            "recorded_date": r.recorded_date.isoformat(),
        }
        for r in records
    ]
