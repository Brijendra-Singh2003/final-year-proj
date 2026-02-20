"""
Auth module - Authentication and Authorization.
"""

from .password import hash_password, verify_password
from .jwt_handler import create_access_token, create_refresh_token, verify_token, decode_token
from .dependencies import (
    get_current_user,
    get_current_admin,
    get_current_doctor,
    get_current_patient,
    require_role,
    security
)

__all__ = [
    "hash_password",
    "verify_password",
    "create_access_token",
    "create_refresh_token",
    "verify_token",
    "decode_token",
    "get_current_user",
    "get_current_admin",
    "get_current_doctor",
    "get_current_patient",
    "require_role",
    "security"
]
