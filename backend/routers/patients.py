from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/patients", tags=["patients"])

require_patient = auth.require_role("patient")


@router.get("/doctors/search", response_model=List[schemas.UserOut])
def search_doctors(
    name: Optional[str] = Query(None),
    specialty: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    query = db.query(models.User).filter(models.User.role == models.RoleEnum.doctor)
    if name:
        query = query.filter(models.User.name.ilike(f"%{name}%"))
    if specialty:
        query = query.filter(models.User.specialty.ilike(f"%{specialty}%"))
    return query.all()


@router.post("/appointments", response_model=schemas.AppointmentOut, status_code=201)
def book_appointment(
    payload: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_patient),
):
    doctor = db.query(models.User).filter(
        models.User.id == payload.doctor_id,
        models.User.role == models.RoleEnum.doctor
    ).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")

    # Check slot conflict
    conflict = db.query(models.Appointment).filter(
        models.Appointment.doctor_id == payload.doctor_id,
        models.Appointment.date == payload.date,
        models.Appointment.time_slot == payload.time_slot,
        models.Appointment.status != models.AppointmentStatus.cancelled,
    ).first()
    if conflict:
        raise HTTPException(status_code=409, detail="This time slot is already booked")

    appt = models.Appointment(
        patient_id=current_user.id,
        doctor_id=payload.doctor_id,
        date=payload.date,
        time_slot=payload.time_slot,
        notes=payload.notes,
    )
    db.add(appt)
    db.commit()
    db.refresh(appt)
    return appt


@router.get("/appointments", response_model=List[schemas.AppointmentOut])
def my_appointments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_patient),
):
    return (
        db.query(models.Appointment)
        .filter(models.Appointment.patient_id == current_user.id)
        .order_by(models.Appointment.date.desc())
        .all()
    )


@router.patch("/appointments/{appt_id}/cancel", response_model=schemas.AppointmentOut)
def cancel_appointment(
    appt_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_patient),
):
    appt = db.query(models.Appointment).filter(
        models.Appointment.id == appt_id,
        models.Appointment.patient_id == current_user.id,
    ).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    if appt.status == models.AppointmentStatus.cancelled:
        raise HTTPException(status_code=400, detail="Already cancelled")
    appt.status = models.AppointmentStatus.cancelled
    db.commit()
    db.refresh(appt)
    return appt


@router.get("/records", response_model=List[schemas.MedicalRecordOut])
def my_records(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_patient),
):
    return (
        db.query(models.MedicalRecord)
        .filter(models.MedicalRecord.patient_id == current_user.id)
        .all()
    )
