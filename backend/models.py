from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.types import TypeDecorator
from datetime import datetime
import enum
import crypto
from database import Base


class EncryptedText(TypeDecorator):
    """Transparently encrypts/decrypts text columns using AES-256-GCM."""
    impl = Text
    cache_ok = True

    def process_bind_param(self, value, dialect):
        return crypto.encrypt_text(value) if value is not None else value

    def process_result_value(self, value, dialect):
        return crypto.decrypt_text(value) if value is not None else value


class RoleEnum(str, enum.Enum):
    patient = "patient"
    doctor = "doctor"
    lab = "lab"
    admin = "admin"


class AppointmentStatus(str, enum.Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"


class LabUploadAssignmentStatus(str, enum.Enum):
    assigned = "assigned"
    uploaded = "uploaded"
    cancelled = "cancelled"
    expired = "expired"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.patient)
    specialty = Column(String, nullable=True)   # for doctors
    phone = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # relationships
    appointments_as_patient = relationship(
        "Appointment", foreign_keys="Appointment.patient_id", back_populates="patient"
    )
    appointments_as_doctor = relationship(
        "Appointment", foreign_keys="Appointment.doctor_id", back_populates="doctor"
    )
    records = relationship("MedicalRecord", back_populates="patient")
    reports_written = relationship("Report", back_populates="doctor")
    lab_upload_assignments_as_doctor = relationship(
        "LabUploadAssignment",
        foreign_keys="LabUploadAssignment.doctor_id",
        back_populates="doctor",
    )
    lab_upload_assignments_as_lab = relationship(
        "LabUploadAssignment",
        foreign_keys="LabUploadAssignment.lab_user_id",
        back_populates="lab_user",
    )
    test_result_files_uploaded = relationship(
        "TestResultFile",
        foreign_keys="TestResultFile.uploaded_by_user_id",
        back_populates="uploaded_by",
    )


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(String, nullable=False)        # "YYYY-MM-DD"
    time_slot = Column(String, nullable=False)   # "09:00 AM"
    status = Column(Enum(AppointmentStatus), default=AppointmentStatus.pending)
    notes = Column(EncryptedText, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    patient = relationship("User", foreign_keys=[patient_id], back_populates="appointments_as_patient")
    doctor = relationship("User", foreign_keys=[doctor_id], back_populates="appointments_as_doctor")
    medical_record = relationship("MedicalRecord", back_populates="appointment", uselist=False)


class MedicalRecord(Base):
    __tablename__ = "medical_records"

    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    appointment_id = Column(Integer, ForeignKey("appointments.id"), nullable=True, unique=True)
    summary = Column(EncryptedText, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("User", back_populates="records")
    appointment = relationship("Appointment", back_populates="medical_record")
    reports = relationship("Report", back_populates="record", cascade="all, delete-orphan")
    lab_upload_assignments = relationship(
        "LabUploadAssignment", back_populates="record", cascade="all, delete-orphan"
    )
    test_result_files = relationship(
        "TestResultFile", back_populates="record", cascade="all, delete-orphan"
    )


class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("medical_records.id"), nullable=False)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(EncryptedText, nullable=False)
    diagnosis = Column(EncryptedText, nullable=True)
    prescription = Column(EncryptedText, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    record = relationship("MedicalRecord", back_populates="reports")
    doctor = relationship("User", back_populates="reports_written")


class LabUploadAssignment(Base):
    __tablename__ = "lab_upload_assignments"

    id = Column(Integer, primary_key=True, index=True)
    record_id = Column(Integer, ForeignKey("medical_records.id"), nullable=False, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    doctor_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    lab_user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    status = Column(Enum(LabUploadAssignmentStatus), nullable=False, default=LabUploadAssignmentStatus.assigned)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    consumed_at = Column(DateTime, nullable=True)

    record = relationship("MedicalRecord", back_populates="lab_upload_assignments")
    patient = relationship("User", foreign_keys=[patient_id])
    doctor = relationship(
        "User",
        foreign_keys=[doctor_id],
        back_populates="lab_upload_assignments_as_doctor",
    )
    lab_user = relationship(
        "User",
        foreign_keys=[lab_user_id],
        back_populates="lab_upload_assignments_as_lab",
    )
    test_result_file = relationship(
        "TestResultFile", back_populates="assignment", uselist=False
    )


class TestResultFile(Base):
    __tablename__ = "test_result_files"

    id = Column(Integer, primary_key=True, index=True)
    assignment_id = Column(
        Integer, ForeignKey("lab_upload_assignments.id"), nullable=False, unique=True
    )
    record_id = Column(Integer, ForeignKey("medical_records.id"), nullable=False, index=True)
    patient_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    uploaded_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    original_filename = Column(String, nullable=False)
    content_type = Column(String, nullable=True)
    size_bytes = Column(Integer, nullable=False)
    storage_path = Column(String, nullable=False)
    hash_algo = Column(String, nullable=False, default="sha256")
    hash_hex = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    assignment = relationship("LabUploadAssignment", back_populates="test_result_file")
    record = relationship("MedicalRecord", back_populates="test_result_files")
    patient = relationship("User", foreign_keys=[patient_id])
    uploaded_by = relationship(
        "User", foreign_keys=[uploaded_by_user_id], back_populates="test_result_files_uploaded"
    )
