from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas, auth

router = APIRouter(prefix="/doctors", tags=["doctors"])

require_doctor = auth.require_role("doctor")


@router.get("/appointments", response_model=List[schemas.AppointmentOut])
def my_appointments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_doctor),
):
    return (
        db.query(models.Appointment)
        .filter(models.Appointment.doctor_id == current_user.id)
        .order_by(models.Appointment.date.asc())
        .all()
    )


@router.patch("/appointments/{appt_id}/confirm", response_model=schemas.AppointmentOut)
def confirm_appointment(
    appt_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_doctor),
):
    appt = db.query(models.Appointment).filter(
        models.Appointment.id == appt_id,
        models.Appointment.doctor_id == current_user.id,
    ).first()
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appt.status = models.AppointmentStatus.confirmed
    db.commit()
    db.refresh(appt)
    return appt


@router.get("/patients/{patient_id}/records", response_model=List[schemas.MedicalRecordOut])
def patient_records(
    patient_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_doctor),
):
    # Doctor can only view records of patients who have an appointment with them
    has_appointment = db.query(models.Appointment).filter(
        models.Appointment.doctor_id == current_user.id,
        models.Appointment.patient_id == patient_id,
    ).first()
    if not has_appointment:
        raise HTTPException(status_code=403, detail="No appointment with this patient")

    records = db.query(models.MedicalRecord).filter(
        models.MedicalRecord.patient_id == patient_id
    ).all()
    return records


@router.post("/records/{record_id}/reports", response_model=schemas.ReportOut, status_code=201)
def append_report(
    record_id: int,
    payload: schemas.ReportCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_doctor),
):
    record = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Medical record not found")

    # Verify the doctor has an appointment with this patient
    has_appointment = db.query(models.Appointment).filter(
        models.Appointment.doctor_id == current_user.id,
        models.Appointment.patient_id == record.patient_id,
    ).first()
    if not has_appointment:
        raise HTTPException(status_code=403, detail="No appointment with this patient")

    report = models.Report(
        record_id=record_id,
        doctor_id=current_user.id,
        content=payload.content,
        diagnosis=payload.diagnosis,
        prescription=payload.prescription,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/patients", response_model=List[schemas.UserOut])
def my_patients(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_doctor),
):
    """List all patients who have ever booked an appointment with this doctor."""
    appts = db.query(models.Appointment).filter(
        models.Appointment.doctor_id == current_user.id
    ).all()
    patient_ids = list({a.patient_id for a in appts})
    return db.query(models.User).filter(models.User.id.in_(patient_ids)).all()
