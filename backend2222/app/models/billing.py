"""
Billing model - Billing and payment records.
"""

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from ..database import Base


class BillingStatus(str, enum.Enum):
    """Billing status."""
    PENDING = "pending"
    UNPAID = "unpaid"
    PAID = "paid"
    PARTIALLY_PAID = "partially_paid"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentMethod(str, enum.Enum):
    """Payment methods."""
    CREDIT_CARD = "credit_card"
    DEBIT_CARD = "debit_card"
    BANK_TRANSFER = "bank_transfer"
    CASH = "cash"
    INSURANCE = "insurance"
    OTHER = "other"


class Billing(Base):
    """
    Billing model - Billing and payment records for appointments and services.
    """
    __tablename__ = "billing"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id", ondelete="CASCADE"), nullable=False, index=True)
    appointment_id = Column(Integer, ForeignKey("appointments.id", ondelete="SET NULL"), nullable=True)
    
    # Billing information
    invoice_number = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(String(500), nullable=True)
    
    # Amount information
    consultation_fee = Column(Integer, default=0)  # in cents/smallest currency unit
    test_fees = Column(Integer, default=0)
    procedure_fees = Column(Integer, default=0)
    medication_fees = Column(Integer, default=0)
    discount = Column(Integer, default=0)
    tax = Column(Integer, default=0)
    total_amount = Column(Integer, nullable=False)  # in cents/smallest currency unit
    
    # Payment tracking
    amount_paid = Column(Integer, default=0)
    amount_due = Column(Integer, nullable=False)
    status = Column(Enum(BillingStatus), default=BillingStatus.UNPAID, nullable=False, index=True)
    payment_method = Column(Enum(PaymentMethod), nullable=True)
    
    # Due date and notes
    due_date = Column(DateTime, nullable=True)
    notes = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    paid_date = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    patient = relationship("Patient", back_populates="billing_records")
    appointment = relationship("Appointment", back_populates="billing_record")

    def __repr__(self):
        return f"<Billing(id={self.id}, invoice_number={self.invoice_number}, status={self.status})>"
