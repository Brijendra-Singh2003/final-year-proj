import os
import uuid
import hashlib
from datetime import datetime

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

import auth
import models
import schemas
from database import get_db


router = APIRouter(prefix="/lab", tags=["lab"])

require_lab = auth.require_role("lab")


def _upload_base_dir() -> str:
    return os.getenv("UPLOAD_DIR", os.path.join(os.path.dirname(__file__), "..", "storage"))


@router.get("/assignments", response_model=list[schemas.LabUploadAssignmentOut])
def my_assignments(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_lab),
):
    return (
        db.query(models.LabUploadAssignment)
        .filter(models.LabUploadAssignment.lab_user_id == current_user.id)
        .order_by(models.LabUploadAssignment.created_at.desc())
        .all()
    )


@router.post(
    "/assignments/{assignment_id}/upload",
    response_model=schemas.TestResultFileOut,
    status_code=201,
)
def upload_test_result(
    assignment_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_lab),
):
    assignment = db.query(models.LabUploadAssignment).filter(
        models.LabUploadAssignment.id == assignment_id
    ).first()
    if not assignment:
        raise HTTPException(status_code=404, detail="Assignment not found")

    if assignment.lab_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not allowed for this assignment")

    if assignment.status != models.LabUploadAssignmentStatus.assigned:
        raise HTTPException(status_code=409, detail="Assignment is not available for upload")

    now = datetime.utcnow()
    if assignment.expires_at and assignment.expires_at <= now:
        assignment.status = models.LabUploadAssignmentStatus.expired
        db.commit()
        raise HTTPException(status_code=409, detail="Assignment expired")

    original_filename = file.filename or "upload"
    content_type = file.content_type

    base_dir = os.path.abspath(_upload_base_dir())
    dest_dir = os.path.join(
        base_dir,
        f"patient_{assignment.patient_id}",
        f"record_{assignment.record_id}",
        f"test_{assignment.id}",
    )
    os.makedirs(dest_dir, exist_ok=True)

    final_name = str(uuid.uuid4())
    final_path = os.path.join(dest_dir, final_name)
    tmp_path = final_path + ".tmp"

    h = hashlib.sha256()
    size_bytes = 0

    try:
        with open(tmp_path, "wb") as out:
            while True:
                chunk = file.file.read(1024 * 1024)
                if not chunk:
                    break
                out.write(chunk)
                h.update(chunk)
                size_bytes += len(chunk)
        os.replace(tmp_path, final_path)
    except Exception:
        try:
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
        except Exception:
            pass
        raise

    test_file = models.TestResultFile(
        assignment_id=assignment.id,
        record_id=assignment.record_id,
        patient_id=assignment.patient_id,
        uploaded_by_user_id=current_user.id,
        original_filename=original_filename,
        content_type=content_type,
        size_bytes=size_bytes,
        storage_path=final_path,
        hash_algo="sha256",
        hash_hex=h.hexdigest(),
    )

    db.add(test_file)
    assignment.status = models.LabUploadAssignmentStatus.uploaded
    assignment.consumed_at = now

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="This assignment already has an uploaded file")

    db.refresh(test_file)
    return test_file

