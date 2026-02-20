"""
Seed script: creates sample admin, doctors, and patients.
Run with: cd backend && python seed.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import engine, SessionLocal
import models
from auth import hash_password

models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

users = [
    {
        "name": "Admin User", "email": "admin@medconnect.com",
        "password": "admin123", "role": "admin",
    },
    {
        "name": "Priya Sharma", "email": "priya@medconnect.com",
        "password": "doctor123", "role": "doctor", "specialty": "Cardiologist",
        "phone": "+91 9800000001",
    },
    {
        "name": "Arjun Mehta", "email": "arjun@medconnect.com",
        "password": "doctor123", "role": "doctor", "specialty": "Neurologist",
        "phone": "+91 9800000002",
    },
    {
        "name": "Sunita Patel", "email": "sunita@medconnect.com",
        "password": "doctor123", "role": "doctor", "specialty": "General Practitioner",
        "phone": "+91 9800000003",
    },
    {
        "name": "Ravi Kumar", "email": "ravi@medconnect.com",
        "password": "patient123", "role": "patient", "phone": "+91 9700000001",
    },
    {
        "name": "Anita Joshi", "email": "anita@medconnect.com",
        "password": "patient123", "role": "patient", "phone": "+91 9700000002",
    },
]

for u in users:
    existing = db.query(models.User).filter(models.User.email == u["email"]).first()
    if not existing:
        user = models.User(
            name=u["name"],
            email=u["email"],
            hashed_password=hash_password(u["password"]),
            role=u["role"],
            specialty=u.get("specialty"),
            phone=u.get("phone"),
        )
        db.add(user)
        db.flush()
        if u["role"] == "patient":
            record = models.MedicalRecord(patient_id=user.id, summary="Initial record")
            db.add(record)

db.commit()
db.close()
print("✅ Seed data created:")
print("   Admin:    admin@medconnect.com / admin123")
print("   Doctors:  priya@medconnect.com / doctor123")
print("             arjun@medconnect.com / doctor123")
print("             sunita@medconnect.com / doctor123")
print("   Patients: ravi@medconnect.com / patient123")
print("             anita@medconnect.com / patient123")
