"""
Billing routes - CRUD operations and payment processing.
"""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel, Field

from ..database import get_db
from ..auth import get_current_user, get_current_admin
from ..models import User
from ..schemas.billing import (
    BillingCreate,
    BillingUpdate,
    BillingResponse,
    BillingDetailResponse
)
from ..services.billing_service import BillingService

router = APIRouter(prefix="/api/billing", tags=["Billing"])


class PaymentInput(BaseModel):
    """Payment processing input."""
    amount: int = Field(..., gt=0)
    payment_method: str


@router.post("", response_model=BillingResponse, status_code=status.HTTP_201_CREATED)
async def create_billing(
    billing_data: BillingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Create a new billing record. (Admin only)"""
    try:
        billing = BillingService.create_billing(db, billing_data)
        return billing
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.get("/patient/invoice", response_model=List[BillingResponse])
async def get_my_billing(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get my billing records as a patient."""
    if current_user.role.value != "patient":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Patients only")
    
    patient = current_user.patient
    if not patient:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Patient profile not found")
    
    billing_records = BillingService.get_patient_billing(
        db,
        patient.id,
        status=status,
        skip=skip,
        limit=limit
    )
    return billing_records


@router.get("", response_model=List[BillingResponse])
async def get_billing_records(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    status: str = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all billing records. (Admin only)"""
    billing_records = BillingService.get_all_billing(
        db,
        skip=skip,
        limit=limit,
        status=status
    )
    return billing_records


@router.get("/{billing_id}", response_model=BillingDetailResponse)
async def get_billing(
    billing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get billing details by ID."""
    billing = BillingService.get_billing_by_id(db, billing_id)
    
    if not billing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Billing record not found")
    
    # Check authorization
    if current_user.role.value == "patient":
        if not (current_user.patient and current_user.patient.id == billing.patient_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return {
        **billing.__dict__,
        "patient_name": billing.patient.user.full_name,
        "patient_email": billing.patient.user.email
    }


@router.put("/{billing_id}", response_model=BillingResponse)
async def update_billing(
    billing_id: int,
    billing_data: BillingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update billing information. (Admin only)"""
    billing = BillingService.get_billing_by_id(db, billing_id)
    
    if not billing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Billing record not found")
    
    try:
        updated_billing = BillingService.update_billing(db, billing_id, billing_data)
        return updated_billing
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.post("/{billing_id}/pay", response_model=BillingResponse)
async def process_payment(
    billing_id: int,
    payment: PaymentInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Process payment for a billing record."""
    billing = BillingService.get_billing_by_id(db, billing_id)
    
    if not billing:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Billing record not found")
    
    # Verify authorization (patient or admin)
    if current_user.role.value == "patient":
        if not (current_user.patient and current_user.patient.id == billing.patient_id):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    try:
        updated_billing = BillingService.process_payment(
            db,
            billing_id,
            payment.amount,
            payment.payment_method
        )
        return updated_billing
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


@router.delete("/{billing_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_billing(
    billing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete a billing record (only unpaid). (Admin only)"""
    try:
        if not BillingService.delete_billing(db, billing_id):
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Billing record not found")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
