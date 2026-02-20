"""
Authentication schemas for request/response validation.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds


class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=255)
    phone: Optional[str] = None


class UserRegister(UserBase):
    """User registration schema."""
    password: str = Field(..., min_length=8, max_length=255)
    confirm_password: str = Field(..., min_length=8, max_length=255)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "username": "johndoe",
                "full_name": "John Doe",
                "phone": "+1234567890",
                "password": "SecurePass123!",
                "confirm_password": "SecurePass123!"
            }
        }


class UserLogin(BaseModel):
    """User login schema."""
    email: EmailStr
    password: str = Field(..., min_length=1)
    
    class Config:
        json_schema_extra = {
            "example": {
                "email": "user@example.com",
                "password": "SecurePass123!"
            }
        }


class UserResponse(UserBase):
    """User response schema."""
    id: int
    role: str
    is_active: bool
    is_verified: bool
    created_at: str
    
    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    """Login response schema."""
    user: UserResponse
    tokens: TokenResponse


class RefreshTokenRequest(BaseModel):
    """Refresh token request schema."""
    refresh_token: str


class PasswordChange(BaseModel):
    """Password change schema."""
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8, max_length=255)
    confirm_password: str = Field(..., min_length=8, max_length=255)


class PasswordReset(BaseModel):
    """Password reset schema."""
    email: EmailStr


class PasswordResetConfirm(BaseModel):
    """Password reset confirmation schema."""
    token: str
    new_password: str = Field(..., min_length=8, max_length=255)
    confirm_password: str = Field(..., min_length=8, max_length=255)
