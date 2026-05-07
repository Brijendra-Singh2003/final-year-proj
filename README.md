# MedConnect – Medical Records & Appointment Booking System

A full-stack health platform built with **Next.js 14** (frontend) + **FastAPI** (backend) with role-based access control for Patients, Doctors, Labs, and Admins.

---

## 🚀 Quick Start

### 1. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python seed.py          # optional – adds demo accounts
uvicorn app.main:app --reload
```

- API runs at **http://localhost:8000**
- Swagger docs at **http://localhost:8000/docs**

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

- App runs at **http://localhost:3000**

---

## 🔐 Demo Accounts (after seeding)

| Role    | Email                    | Password    |
|---------|--------------------------|-------------|
| Admin   | admin@medconnect.com     | admin123    |
| Doctor  | priya@medconnect.com     | doctor123   |
| Doctor  | arjun@medconnect.com     | doctor123   |
| Lab     | lab@medconnect.com       | lab123      |
| Patient | ravi@medconnect.com      | patient123  |
| Patient | anita@medconnect.com     | patient123  |

---

## 📁 Structure

```
final-year-proj/
├── docker-compose.yaml
├── backend/                    # FastAPI backend
│   ├── seed.py
│   ├── requirements.txt
│   └── app/
│       ├── main.py
│       ├── models.py
│       ├── schemas.py
│       ├── config/
│       │   └── database.py
│       ├── utils/
│       │   ├── auth.py
│       │   ├── crypto.py
│       │   └── audit.py
│       └── routers/
│           ├── __init__.py
│           ├── auth.py
│           ├── patients.py
│           ├── doctors.py
│           ├── admin.py
│           ├── lab.py
│           └── files.py
├── frontend/                   # Next.js 14 frontend
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   ├── patient/            # dashboard, search, records, appointments
│   │   ├── doctor/             # dashboard, appointments, patients
│   │   ├── admin/              # dashboard
│   │   └── lab/                # dashboard, assignments
│   ├── components/
│   │   └── Navbar.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   ├── lib/
│   │   └── api.ts
│   └── middleware.ts           # route guards
└── mobile/                     # Flutter mobile app
    ├── pubspec.yaml
    └── lib/
        ├── main.dart
        ├── core/
        ├── features/
        └── riverpod/
```

---

## ✨ Features by Role

### 🧑‍⚕️ Patient
- Register / login
- Search doctors by name or specialty
- Book / cancel appointments with time-slot conflict check
- View digital medical records with full report history

### 👨‍⚕️ Doctor
- View all own appointments, confirm pending ones
- Browse patient list (only patients who've booked)
- View full patient medical history
- Append clinical reports (notes, diagnosis, prescription)

### 🧪 Lab
- View lab test assignments
- Update / upload lab results for assigned patients

### 🛡️ Admin
- View all users with role filter
- Delete any user (except self)
