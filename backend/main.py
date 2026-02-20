from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import auth, patients, doctors, admin

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MedConnect API",
    description="Medical Records & Appointment Booking System",
    version="1.0.0",
)

# CORS - allow Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(doctors.router)
app.include_router(admin.router)


@app.get("/", tags=["root"])
def read_root():
    return {"message": "MedConnect API is running", "docs": "/docs"}
