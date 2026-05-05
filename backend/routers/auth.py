from fastapi import APIRouter, Depends, HTTPException, Response, Request, status
from sqlalchemy.orm import Session
from database import get_db
import models, schemas, auth, audit
from datetime import timedelta

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=schemas.UserOut, status_code=201)
def register(payload: schemas.UserRegister, request: Request, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = models.User(
        name=payload.name,
        email=payload.email,
        hashed_password=auth.hash_password(payload.password),
        role=payload.role,
        specialty=payload.specialty,
        phone=payload.phone,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # auto-create medical record for patients
    if user.role == models.RoleEnum.patient:
        record = models.MedicalRecord(patient_id=user.id, summary="Initial record")
        db.add(record)
        db.commit()

    audit.log(db, "user.register", user_id=user.id, resource_type="user", resource_id=user.id,
              details=f"role={user.role}", ip_address=request.client.host if request.client else None)
    return user


@router.post("/login")
def login(payload: schemas.UserLogin, request: Request, response: Response, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user or not auth.verify_password(payload.password, user.hashed_password):
        audit.log(db, "auth.login_failed", details=f"email={payload.email}",
                  ip_address=request.client.host if request.client else None)
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = auth.create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=timedelta(minutes=60),
    )
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        max_age=3600,
        samesite="lax",
    )
    audit.log(db, "auth.login", user_id=user.id, resource_type="user", resource_id=user.id,
              ip_address=request.client.host if request.client else None)
    return {"message": "Login successful", "user": schemas.UserOut.model_validate(user), "token": token}


@router.post("/logout")
def logout(response: Response, request: Request, db: Session = Depends(get_db),
           current_user: models.User = Depends(auth.get_current_user)):
    response.delete_cookie("access_token")
    audit.log(db, "auth.logout", user_id=current_user.id,
              ip_address=request.client.host if request.client else None)
    return {"message": "Logged out"}


@router.get("/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user
