"""
FastAPI dependencies for authentication and authorization.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
import logging

from ..database import get_db
from ..models import User
from .jwt_handler import decode_token
from ..config import settings

logger = logging.getLogger(__name__)

# HTTP Bearer authentication scheme
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get the current authenticated user from JWT token.
    
    Args:
        credentials: HTTP Bearer token from request header
        db: Database session
        
    Returns:
        User object from database
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    token = credentials.credentials
    
    # Verify and decode token
    token_payload = decode_token(token)
    
    if not token_payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Get user from database
    user = db.query(User).filter(User.id == token_payload.user_id).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Inactive user"
        )
    
    return user


async def get_current_admin(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current user and verify admin role.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User object if user is admin
        
    Raises:
        HTTPException: If user is not admin
    """
    if current_user.role.value != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


async def get_current_doctor(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current user and verify doctor role.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User object if user is doctor
        
    Raises:
        HTTPException: If user is not doctor
    """
    if current_user.role.value != "doctor":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Doctor access required"
        )
    return current_user


async def get_current_patient(
    current_user: User = Depends(get_current_user)
) -> User:
    """
    Get current user and verify patient role.
    
    Args:
        current_user: Current authenticated user
        
    Returns:
        User object if user is patient
        
    Raises:
        HTTPException: If user is not patient
    """
    if current_user.role.value != "patient":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Patient access required"
        )
    return current_user


def require_role(*roles: str):
    """
    Create a dependency that requires one of the specified roles.
    
    Args:
        roles: Variable number of role strings
        
    Returns:
        Async function that checks user role
        
    Example:
        @router.get("/admin", dependencies=[Depends(require_role("admin"))])
        async def admin_only():
            pass
    """
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role.value not in roles:
            logger.warning(f"User {current_user.id} attempted unauthorized access. Required: {roles}, Got: {current_user.role}")
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(roles)}"
            )
        return current_user
    
    return role_checker
