from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from database import get_db
import models, schemas, auth, audit

router = APIRouter(prefix="/admin", tags=["admin"])

require_admin = auth.require_role("admin")


@router.get("/users", response_model=List[schemas.UserOut])
def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    return db.query(models.User).all()


@router.delete("/users/{user_id}", status_code=204)
def delete_user(
    user_id: int,
    request: Request,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.id == current_user.id: # type: ignore
        raise HTTPException(status_code=400, detail="Cannot delete yourself")
    audit.log(db, "admin.user_deleted", user_id=current_user.id, resource_type="user",
              resource_id=user_id, details=f"deleted_email={user.email} role={user.role}",
              ip_address=request.client.host if request.client else None)
    db.delete(user)
    db.commit()


@router.get("/appointments", response_model=List[schemas.AppointmentOut])
def all_appointments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    return db.query(models.Appointment).all()


@router.get("/records", response_model=List[schemas.MedicalRecordOut])
def all_records(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    return db.query(models.MedicalRecord).all()


@router.get("/audit-logs/verify")
def verify_audit_chain(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    valid, broken_id = audit.verify_chain(db)
    return {"valid": valid, "first_broken_id": broken_id}


@router.get("/audit-logs")
def list_audit_logs(
    skip: int = 0,
    limit: int = 50,
    action: str | None = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    q = db.query(models.AuditLog).order_by(models.AuditLog.id.desc())
    if action:
        q = q.filter(models.AuditLog.action == action)
    total = q.count()
    logs = q.offset(skip).limit(limit).all()
    return {
        "total": total,
        "items": [
            {
                "id": l.id,
                "user_id": l.user_id,
                "action": l.action,
                "resource_type": l.resource_type,
                "resource_id": l.resource_id,
                "details": l.details,
                "ip_address": l.ip_address,
                "timestamp": l.timestamp.isoformat(),
                "row_hash": l.row_hash,
            }
            for l in logs
        ],
    }


@router.get("/stats")
def system_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_admin),
):
    appt_counts: dict[str, int] = dict(
        db.query(models.Appointment.status, func.count())
        .group_by(models.Appointment.status)
        .all()
    )
    return {
        "users": {
            role.value: db.query(models.User).filter(models.User.role == role).count()
            for role in models.RoleEnum
        },
        "appointments": {
            "total": db.query(models.Appointment).count(),
            "pending": appt_counts.get("pending", 0),
            "confirmed": appt_counts.get("confirmed", 0),
            "cancelled": appt_counts.get("cancelled", 0),
        },
        "records": db.query(models.MedicalRecord).count(),
        "reports": db.query(models.Report).count(),
        "lab_assignments": db.query(models.LabUploadAssignment).count(),
        "audit_logs": db.query(models.AuditLog).count(),
    }
