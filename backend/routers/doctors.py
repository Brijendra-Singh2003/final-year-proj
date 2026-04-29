from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models, schemas, auth, audit
from datetime import datetime

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
    request: Request,
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
    audit.log(db, "appointment.confirmed", user_id=current_user.id, resource_type="appointment",
              resource_id=appt_id, ip_address=request.client.host if request.client else None)
    return appt


@router.post("/patients/{patient_id}/records", response_model=schemas.MedicalRecordOut, status_code=201)
def create_patient_record(
    patient_id: int,
    payload: schemas.MedicalRecordCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_doctor),
):
    has_appointment = db.query(models.Appointment).filter(
        models.Appointment.doctor_id == current_user.id,
        models.Appointment.patient_id == patient_id,
    ).first()
    if not has_appointment:
        raise HTTPException(status_code=403, detail="No appointment with this patient")

    record = models.MedicalRecord(patient_id=patient_id, summary=payload.summary)
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


@router.get("/patients/{patient_id}/records", response_model=List[schemas.MedicalRecordOut])
def patient_records(
    patient_id: int,
    request: Request,
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

    audit.log(db, "records.viewed", user_id=current_user.id, resource_type="patient",
              resource_id=patient_id, ip_address=request.client.host if request.client else None)
    records = db.query(models.MedicalRecord).filter(
        models.MedicalRecord.patient_id == patient_id
    ).all()
    return records


@router.post("/records/{record_id}/reports", response_model=schemas.ReportOut, status_code=201)
def append_report(
    record_id: int,
    payload: schemas.ReportCreate,
    request: Request,
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
    audit.log(db, "report.created", user_id=current_user.id, resource_type="report",
              resource_id=report.id, details=f"record_id={record_id} patient_id={record.patient_id}",
              ip_address=request.client.host if request.client else None)
    return report


@router.post(
    "/records/{record_id}/lab-assignments",
    response_model=schemas.LabUploadAssignmentOut,
    status_code=201,
)
def create_lab_assignment(
    record_id: int,
    payload: schemas.LabUploadAssignmentCreate,
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

    lab_user = db.query(models.User).filter(models.User.id == payload.lab_user_id).first()
    if not lab_user or lab_user.role != models.RoleEnum.lab:
        raise HTTPException(status_code=404, detail="Lab uploader not found")

    if payload.expires_at and payload.expires_at <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="expires_at must be in the future")

    assignment = models.LabUploadAssignment(
        record_id=record_id,
        patient_id=record.patient_id,
        doctor_id=current_user.id,
        lab_user_id=payload.lab_user_id,
        status=models.LabUploadAssignmentStatus.assigned,
        expires_at=payload.expires_at,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)
    return assignment


@router.get(
    "/records/{record_id}/lab-assignments",
    response_model=List[schemas.LabUploadAssignmentOut],
)
def list_lab_assignments(
    record_id: int,
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

    return (
        db.query(models.LabUploadAssignment)
        .filter(models.LabUploadAssignment.record_id == record_id)
        .order_by(models.LabUploadAssignment.created_at.desc())
        .all()
    )


@router.get(
    "/records/{record_id}/test-files",
    response_model=List[schemas.TestResultFileOut],
)
def list_test_files(
    record_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_doctor),
):
    record = db.query(models.MedicalRecord).filter(models.MedicalRecord.id == record_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Medical record not found")

    has_appointment = db.query(models.Appointment).filter(
        models.Appointment.doctor_id == current_user.id,
        models.Appointment.patient_id == record.patient_id,
    ).first()
    if not has_appointment:
        raise HTTPException(status_code=403, detail="No appointment with this patient")

    return (
        db.query(models.TestResultFile)
        .filter(models.TestResultFile.record_id == record_id)
        .order_by(models.TestResultFile.created_at.desc())
        .all()
    )


@router.get("/lab-users", response_model=List[schemas.UserOut])
def list_lab_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_doctor),
):
    """Return all lab users so the doctor can pick one when creating an assignment."""
    return db.query(models.User).filter(models.User.role == models.RoleEnum.lab).all()


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
