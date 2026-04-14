import hashlib
import os

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

import auth
import models
from database import get_db


router = APIRouter(prefix="/files", tags=["files"])


@router.get("/{file_id}/download")
def download_file(
    file_id: int,
    verify_hash: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user),
):
    f = db.query(models.TestResultFile).filter(models.TestResultFile.id == file_id).first()
    if not f:
        raise HTTPException(status_code=404, detail="File not found")

    # Authorization:
    # - patient: only own files
    # - doctor: must have appointment with the patient
    # - admin: allowed
    if current_user.role == models.RoleEnum.patient:
        if f.patient_id != current_user.id:
            raise HTTPException(status_code=403, detail="Access denied")
    elif current_user.role == models.RoleEnum.doctor:
        has_appointment = db.query(models.Appointment).filter(
            models.Appointment.doctor_id == current_user.id,
            models.Appointment.patient_id == f.patient_id,
        ).first()
        if not has_appointment:
            raise HTTPException(status_code=403, detail="No appointment with this patient")
    elif current_user.role == models.RoleEnum.admin:
        pass
    else:
        raise HTTPException(status_code=403, detail="Access denied")

    if not os.path.exists(f.storage_path):
        raise HTTPException(status_code=404, detail="File missing on server")

    if verify_hash:
        h = hashlib.sha256()
        with open(f.storage_path, "rb") as src:
            for chunk in iter(lambda: src.read(1024 * 1024), b""):
                h.update(chunk)
        if f.hash_algo.lower() == "sha256" and h.hexdigest() != f.hash_hex:
            raise HTTPException(status_code=409, detail="File integrity check failed")

    return FileResponse(
        path=f.storage_path,
        media_type=f.content_type or "application/octet-stream",
        filename=f.original_filename,
    )

