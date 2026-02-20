"""
Billing service - Business logic for billing operations.
"""

from sqlalchemy.orm import Session
from datetime import datetime
import logging
import uuid

from ..models import Billing, Patient, Appointment
from ..models.billing import BillingStatus
from ..schemas.billing import BillingCreate, BillingUpdate

logger = logging.getLogger(__name__)


class BillingService:
    """Service for billing-related operations."""
    
    @staticmethod
    def _generate_invoice_number() -> str:
        """Generate unique invoice number."""
        return f"INV-{datetime.utcnow().strftime('%Y%m%d')}-{uuid.uuid4().hex[:8].upper()}"
    
    @staticmethod
    def create_billing(db: Session, billing_data: BillingCreate) -> Billing:
        """
        Create a new billing record.
        
        Args:
            db: Database session
            billing_data: Billing creation data
            
        Returns:
            Created billing record
        """
        try:
            # Verify patient exists
            patient = db.query(Patient).filter(Patient.id == billing_data.patient_id).first()
            if not patient:
                raise ValueError("Patient not found")
            
            # Verify appointment exists if provided
            if billing_data.appointment_id:
                appointment = db.query(Appointment).filter(
                    Appointment.id == billing_data.appointment_id
                ).first()
                if not appointment:
                    raise ValueError("Appointment not found")
            
            # Calculate total amount
            total_amount = (
                billing_data.consultation_fee +
                billing_data.test_fees +
                billing_data.procedure_fees +
                billing_data.medication_fees +
                billing_data.tax -
                billing_data.discount
            )
            
            billing = Billing(
                **billing_data.dict(),
                invoice_number=BillingService._generate_invoice_number(),
                total_amount=total_amount,
                amount_due=total_amount,
                status=BillingStatus.UNPAID
            )
            
            db.add(billing)
            db.commit()
            db.refresh(billing)
            
            logger.info(f"Billing created: {billing.id} (Invoice: {billing.invoice_number})")
            return billing
        except Exception as e:
            db.rollback()
            logger.error(f"Error creating billing: {str(e)}")
            raise
    
    @staticmethod
    def get_billing_by_id(db: Session, billing_id: int) -> Billing:
        """Get billing by ID."""
        return db.query(Billing).filter(Billing.id == billing_id).first()
    
    @staticmethod
    def get_billing_by_invoice(db: Session, invoice_number: str) -> Billing:
        """Get billing by invoice number."""
        return db.query(Billing).filter(Billing.invoice_number == invoice_number).first()
    
    @staticmethod
    def get_patient_billing(
        db: Session,
        patient_id: int,
        status: str = None,
        skip: int = 0,
        limit: int = 50
    ):
        """Get billing records for a patient."""
        query = db.query(Billing).filter(Billing.patient_id == patient_id)
        
        if status:
            query = query.filter(Billing.status == status)
        
        return query.order_by(Billing.created_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def get_all_billing(
        db: Session,
        skip: int = 0,
        limit: int = 50,
        status: str = None
    ):
        """Get all billing records with optional status filter."""
        query = db.query(Billing)
        
        if status:
            query = query.filter(Billing.status == status)
        
        return query.order_by(Billing.created_at.desc()).offset(skip).limit(limit).all()
    
    @staticmethod
    def update_billing(
        db: Session,
        billing_id: int,
        billing_data: BillingUpdate
    ) -> Billing:
        """
        Update billing information.
        
        Args:
            db: Database session
            billing_id: Billing ID
            billing_data: Update data
            
        Returns:
            Updated billing record
        """
        try:
            billing = db.query(Billing).filter(Billing.id == billing_id).first()
            if not billing:
                raise ValueError("Billing record not found")
            
            update_data = billing_data.dict(exclude_unset=True)
            
            # Update amount paid if provided
            if "amount_paid" in update_data:
                new_amount_paid = update_data["amount_paid"]
                
                # Validate amount paid doesn't exceed total
                if new_amount_paid > billing.total_amount:
                    raise ValueError("Amount paid cannot exceed total amount")
                
                billing.amount_paid = new_amount_paid
                billing.amount_due = billing.total_amount - new_amount_paid
                
                # Update status based on payment
                if new_amount_paid == 0:
                    billing.status = BillingStatus.UNPAID
                elif new_amount_paid == billing.total_amount:
                    billing.status = BillingStatus.PAID
                    billing.paid_date = datetime.utcnow()
                else:
                    billing.status = BillingStatus.PARTIALLY_PAID
                
                del update_data["amount_paid"]
            
            # Update other fields
            for key, value in update_data.items():
                setattr(billing, key, value)
            
            billing.updated_at = datetime.utcnow()
            db.commit()
            db.refresh(billing)
            
            logger.info(f"Billing updated: {billing.id}")
            return billing
        except Exception as e:
            db.rollback()
            logger.error(f"Error updating billing: {str(e)}")
            raise
    
    @staticmethod
    def process_payment(
        db: Session,
        billing_id: int,
        amount: int,
        payment_method: str
    ) -> Billing:
        """
        Process payment for a billing record.
        
        Args:
            db: Database session
            billing_id: Billing ID
            amount: Payment amount
            payment_method: Payment method used
            
        Returns:
            Updated billing record
        """
        try:
            billing = db.query(Billing).filter(Billing.id == billing_id).first()
            if not billing:
                raise ValueError("Billing record not found")
            
            if billing.status == BillingStatus.PAID:
                raise ValueError("Bill is already paid")
            
            if amount <= 0:
                raise ValueError("Payment amount must be greater than 0")
            
            new_amount_paid = billing.amount_paid + amount
            
            if new_amount_paid > billing.total_amount:
                raise ValueError("Payment amount exceeds remaining balance")
            
            billing.amount_paid = new_amount_paid
            billing.amount_due = billing.total_amount - new_amount_paid
            billing.payment_method = payment_method
            
            # Update status
            if billing.amount_due == 0:
                billing.status = BillingStatus.PAID
                billing.paid_date = datetime.utcnow()
                logger.info(f"Billing fully paid: {billing.id}")
            else:
                billing.status = BillingStatus.PARTIALLY_PAID
                logger.info(f"Partial payment received for billing: {billing.id}")
            
            db.commit()
            db.refresh(billing)
            
            return billing
        except Exception as e:
            db.rollback()
            logger.error(f"Error processing payment: {str(e)}")
            raise
    
    @staticmethod
    def delete_billing(db: Session, billing_id: int) -> bool:
        """
        Delete a billing record.
        Only unpaid records can be deleted.
        
        Args:
            db: Database session
            billing_id: Billing ID
            
        Returns:
            True if deleted, False if not found
        """
        try:
            billing = db.query(Billing).filter(Billing.id == billing_id).first()
            if not billing:
                return False
            
            if billing.status != BillingStatus.UNPAID:
                raise ValueError("Only unpaid bills can be deleted")
            
            db.delete(billing)
            db.commit()
            
            logger.info(f"Billing deleted: {billing_id}")
            return True
        except Exception as e:
            db.rollback()
            logger.error(f"Error deleting billing: {str(e)}")
            raise
