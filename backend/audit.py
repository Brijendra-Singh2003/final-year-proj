import hashlib
import json
from datetime import datetime
from typing import Optional

from sqlalchemy.orm import Session

import models


def _compute_hash(
    timestamp: str,
    user_id: Optional[int],
    action: str,
    resource_type: Optional[str],
    resource_id: Optional[int],
    details: Optional[str],
    prev_hash: Optional[str],
) -> str:
    payload = json.dumps({
        "timestamp": timestamp,
        "user_id": user_id,
        "action": action,
        "resource_type": resource_type,
        "resource_id": resource_id,
        "details": details,
        "prev_hash": prev_hash or "",
    }, sort_keys=True)
    return hashlib.sha256(payload.encode()).hexdigest()


def log(
    db: Session,
    action: str,
    user_id: Optional[int] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[int] = None,
    details: Optional[str] = None,
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
) -> models.AuditLog:
    last = (
        db.query(models.AuditLog)
        .order_by(models.AuditLog.id.desc())
        .first()
    )
    prev_hash = last.row_hash if last else None
    timestamp = datetime.utcnow()
    row_hash = _compute_hash(
        timestamp.isoformat(), user_id, action,
        resource_type, resource_id, details, prev_hash,
    )
    entry = models.AuditLog(
        user_id=user_id,
        action=action,
        resource_type=resource_type,
        resource_id=resource_id,
        details=details,
        ip_address=ip_address,
        user_agent=user_agent,
        timestamp=timestamp,
        prev_hash=prev_hash,
        row_hash=row_hash,
    )
    db.add(entry)
    db.commit()
    return entry


def verify_chain(db: Session) -> tuple[bool, Optional[int]]:
    """Verify the entire audit log chain. Returns (is_valid, first_broken_id)."""
    logs = db.query(models.AuditLog).order_by(models.AuditLog.id.asc()).all()
    prev_hash = None
    for entry in logs:
        expected = _compute_hash(
            entry.timestamp.isoformat(), entry.user_id, entry.action,
            entry.resource_type, entry.resource_id, entry.details, prev_hash,
        )
        if entry.row_hash != expected or entry.prev_hash != prev_hash:
            return False, entry.id
        prev_hash = entry.row_hash
    return True, None
