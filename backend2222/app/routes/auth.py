"""
Authentication routes - Login, Register, and Token Refresh.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import timedelta
import logging

from ..database import get_db
from ..models import User
from ..models.user import UserRole
from ..auth.password import hash_password, verify_password
from ..auth.jwt_handler import create_access_token, create_refresh_token, decode_token
from ..auth.dependencies import get_current_user
from ..schemas.auth import (
    UserRegister,
    UserLogin,
    LoginResponse,
    UserResponse,
    TokenResponse,
    RefreshTokenRequest,
)
from ..config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])
logger = logging.getLogger(__name__)


@router.post("/register", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserRegister,
    db: Session = Depends(get_db)
) -> LoginResponse:
    """
    Register a new user.
    
    Args:
        user_data: User registration data
        db: Database session
        
    Returns:
        LoginResponse with user data and tokens
        
    Raises:
        HTTPException: If email/username already exists or passwords don't match
    """
    # Validate passwords match
    if user_data.password != user_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    # Check if email already exists
    existing_email = db.query(User).filter(User.email == user_data.email).first()
    if existing_email:
        logger.warning(f"Registration attempt with existing email: {user_data.email}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Check if username already exists
    existing_username = db.query(User).filter(User.username == user_data.username).first()
    if existing_username:
        logger.warning(f"Registration attempt with existing username: {user_data.username}")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    try:
        new_user = User(
            email=user_data.email,
            username=user_data.username,
            full_name=user_data.full_name,
            phone=user_data.phone,
            hashed_password=hash_password(user_data.password),
            role=UserRole.PATIENT,  # Default role is patient
            is_active=True,
            is_verified=False
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        logger.info(f"New user registered: {new_user.id} ({new_user.email})")
        
        # Generate tokens
        token_data = {
            "sub": new_user.id,
            # "user_id": new_user.id,
            "email": new_user.email,
            "role": new_user.role.value
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return LoginResponse(
            user=UserResponse(
                id=new_user.id,
                email=new_user.email,
                username=new_user.username,
                full_name=new_user.full_name,
                phone=new_user.phone,
                role=new_user.role.value,
                is_active=new_user.is_active,
                is_verified=new_user.is_verified,
                created_at=new_user.created_at.isoformat()
            ),
            tokens=TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token,
                expires_in=settings.access_token_expire_minutes * 60
            )
        )
    
    except Exception as e:
        db.rollback()
        logger.error(f"Error registering user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Registration failed"
        )


@router.post("/login", response_model=LoginResponse)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
) -> LoginResponse:
    """
    User login endpoint.
    
    Args:
        credentials: Email and password
        db: Database session
        
    Returns:
        LoginResponse with user data and tokens
        
    Raises:
        HTTPException: If credentials are invalid
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user:
        logger.warning(f"Login attempt with non-existent email: {credentials.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user.hashed_password):
        logger.warning(f"Failed login attempt for user: {user.id}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Check if user is active
    if not user.is_active:
        logger.warning(f"Login attempt for inactive user: {user.id}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    # Update last login timestamp
    try:
        from datetime import datetime
        user.last_login = datetime.utcnow()
        db.commit()
        logger.info(f"User logged in: {user.id} ({user.email})")
    except Exception as e:
        db.rollback()
        logger.error(f"Error updating last login: {str(e)}")
    
    # Generate tokens
    token_data = {
        "sub": user.id,
        "user_id": user.id,
        "email": user.email,
        "role": user.role.value
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return LoginResponse(
        user=UserResponse(
            id=user.id,
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            phone=user.phone,
            role=user.role.value,
            is_active=user.is_active,
            is_verified=user.is_verified,
            created_at=user.created_at.isoformat()
        ),
        tokens=TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=settings.access_token_expire_minutes * 60
        )
    )


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: RefreshTokenRequest,
    db: Session = Depends(get_db)
) -> TokenResponse:
    """
    Refresh access token using refresh token.
    
    Args:
        request: Refresh token request
        db: Database session
        
    Returns:
        TokenResponse with new access token
        
    Raises:
        HTTPException: If refresh token is invalid
    """
    # Decode refresh token
    token_payload = decode_token(request.refresh_token)
    
    if not token_payload or token_payload.exp < __import__('datetime').datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    # Get user from database
    user = db.query(User).filter(User.id == token_payload.user_id).first()
    
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Generate new access token
    token_data = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role.value if hasattr(user.role, "value") else user.role
    }
    
    new_access_token = create_access_token(token_data)
    
    logger.info(f"Token refreshed for user: {user.id}")
    
    return TokenResponse(
        access_token=new_access_token,
        refresh_token=request.refresh_token,  # Return same refresh token
        expires_in=settings.access_token_expire_minutes * 60
    )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(get_current_user)
) -> UserResponse:
    """
    Get current authenticated user information.
    
    Args:
        current_user: Current authenticated user from dependency
        
    Returns:
        UserResponse with user details
    """
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        username=current_user.username,
        full_name=current_user.full_name,
        phone=current_user.phone,
        role=current_user.role.value,
        is_active=current_user.is_active,
        is_verified=current_user.is_verified,
        created_at=current_user.created_at.isoformat()
    )


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Logout endpoint (token invalidation on client side).
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        Success message
    """
    logger.info(f"User logged out: {current_user.id}")
    return {"message": "Successfully logged out"}
