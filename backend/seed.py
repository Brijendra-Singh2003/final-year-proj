"""
Seed script: creates sample admin, doctors (all specialties), lab uploader, and patients.
Run with: cd backend && python seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from database import engine, SessionLocal
import models
from auth import hash_password

# Create tables
models.Base.metadata.create_all(bind=engine)
db = SessionLocal()

SPECIALTIES = [
    "General Practitioner",
    "Dentist",
    "Orthopedic Surgeon",
    "Dermatologist",
    "Gynecologist",
    "Pediatrician",
    "Cardiologist",
    "Ophthalmologist",
    "ENT Specialist",
    "Psychiatrist",
    "Nutritionist",
    "Physiotherapist",
    "Neurologist",
    "Urologist",
    "Oncologist",
]

# Base users
users = [
    {
        "name": "Admin User",
        "email": "admin@medconnect.com",
        "password": "admin123",
        "role": "admin",
    },
    {
        "name": "Apex Diagnostics",
        "email": "lab@medconnect.com",
        "password": "lab123",
        "role": "lab",
        "phone": "+91 9600000001",
    },
    {
        "name": "Ravi Kumar",
        "email": "ravi@medconnect.com",
        "password": "patient123",
        "role": "patient",
        "phone": "+91 9700000001",
    },
    {
        "name": "Anita Joshi",
        "email": "anita@medconnect.com",
        "password": "patient123",
        "role": "patient",
        "phone": "+91 9700000002",
    },
]

# Add one doctor for each specialty
doctor_names = [
    "Priya Sharma",
    "Arjun Mehta",
    "Sunita Patel",
    "Rahul Verma",
    "Neha Reddy",
    "Vikram Singh",
    "Kavya Nair",
    "Rohan Das",
    "Sneha Iyer",
    "Amit Kulkarni",
    "Pooja Malhotra",
    "Manoj Gupta",
    "Deepika Rao",
    "Kiran Joshi",
    "Suresh Menon",
]

for i, specialty in enumerate(SPECIALTIES):
    name = doctor_names[i]
    email_prefix = name.split(" ")[0].lower()

    users.append({
        "name": name,
        "email": f"{email_prefix}@medconnect.com",
        "password": "doctor123",
        "role": "doctor",
        "specialty": specialty,
        "phone": f"+91 98000000{i+1:02d}",
    })

# Insert users if not exists
for u in users:
    existing = db.query(models.User).filter(
        models.User.email == u["email"]
    ).first()

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

db.commit()
db.close()

print("✅ Seed data created successfully!")
print("\nAdmin Login:")
print("   admin@medconnect.com / admin123")

print("\nDoctor Login:")
print("   doctor1@medconnect.com / doctor123")
print("   ...")
print("   doctor15@medconnect.com / doctor123")

print("\nLab Login:")
print("   lab@medconnect.com / lab123")

print("\nPatient Login:")
print("   ravi@medconnect.com / patient123")
print("   anita@medconnect.com / patient123")