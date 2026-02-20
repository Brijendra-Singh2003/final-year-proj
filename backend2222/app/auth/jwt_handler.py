"""
JWT token generation and verification.
"""

from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
import logging

from ..config import settings

logger = logging.getLogger(__name__)


class TokenPayload:
    """Token payload structure."""
    def __init__(self, user_id: int, email: str, role: str, exp: datetime):
        self.user_id = user_id
        self.email = email
        self.role = role
        self.exp = exp


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token.
    
    Args:
        data: Dictionary containing token claims (sub, user_id, email, role)
        expires_delta: Custom expiration time, defaults to settings.access_token_expire_minutes
        
    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
    
    to_encode.update({"exp": expire, "iat": datetime.utcnow()})
    
    try:
        encoded_jwt = jwt.encode(
            to_encode,
            settings.secret_key,
            algorithm=settings.algorithm
        )
        logger.info(f"Access token created for user: {data.get('email')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error creating access token: {str(e)}")
        raise


def create_refresh_token(data: Dict[str, Any]) -> str:
    """
    Create a JWT refresh token.
    
    Args:
        data: Dictionary containing token claims
        
    Returns:
        Encoded JWT refresh token
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=settings.refresh_token_expire_days)
    to_encode.update({"exp": expire, "iat": datetime.utcnow(), "type": "refresh"})
    
    try:
        encoded_jwt = jwt.encode(
            to_encode,
            settings.secret_key,
            algorithm=settings.algorithm
        )
        logger.info(f"Refresh token created for user: {data.get('email')}")
        return encoded_jwt
    except Exception as e:
        logger.error(f"Error creating refresh token: {str(e)}")
        raise


def verify_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode a JWT token.
    
    Args:
        token: JWT token to verify
        
    Returns:
        Token payload if valid, None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.algorithm]
        )
        print("DECODED PAYLOAD:", payload)
        return payload
    except JWTError as e:
        logger.warning(f"Invalid token: {str(e)}")
        print("JWT ERROR:", str(e))
        return None
    except Exception as e:
        logger.error(f"Error verifying token: {str(e)}")
        print("GENERAL ERROR:", str(e))
        return None


def decode_token(token: str) -> Optional[TokenPayload]:
    """
    Decode a token and return TokenPayload object.
    
    Args:
        token: JWT token to decode
        
    Returns:
        TokenPayload object if valid, None if invalid
    """
    payload = verify_token(token)
    
    if not payload:
        return None
    
    try:
        user_id: int = payload.get("user_id")
        email = payload.get("email")
        role = payload.get("role")
        sub = payload.get("sub")
        exp: datetime = datetime.fromtimestamp(payload.get("exp"))
        if not sub:
            return None
        user_id = int(sub)
        if not all([user_id, email, role, sub]):
            logger.warning("Missing required fields in token payload")
            return None
        
        return TokenPayload(sub=sub, user_id=user_id, email=email, role=role, exp=exp)
    except Exception as e:
        logger.error(f"Error decoding token payload: {str(e)}")
        return None
