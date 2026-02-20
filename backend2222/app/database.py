"""
Database connection and session management for PostgreSQL.
Uses SQLAlchemy ORM for database operations.
"""

from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Optional, Generator
import logging

from .config import settings

# Configure logging
logger = logging.getLogger(__name__)

# Create the base class for all models
Base = declarative_base()

# Build database URL
DATABASE_URL = f"postgresql://{settings.db_user}:{settings.db_password}@{settings.db_host}:{settings.db_port}/{settings.db_name}"

# Create database engine with connection pooling
engine = create_engine(
    DATABASE_URL,
    echo=settings.sql_echo,  # Log all SQL statements if True
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True,  # Verify connections before using them
    pool_recycle=3600,  # Recycle connections after 1 hour
)

# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency to get database session for FastAPI routes.
    Usage: def my_route(db: Session = Depends(get_db)):
    """
    db = SessionLocal()
    try:
        yield db
    except SQLAlchemyError as e:
        logger.error(f"Database error: {str(e)}")
        db.rollback()
        raise
    finally:
        db.close()


def create_tables():
    """Create all tables in the database."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except SQLAlchemyError as e:
        logger.error(f"Error creating database tables: {str(e)}")
        raise


def drop_tables():
    """Drop all tables from the database (use with caution)."""
    try:
        Base.metadata.drop_all(bind=engine)
        logger.info("Database tables dropped successfully")
    except SQLAlchemyError as e:
        logger.error(f"Error dropping database tables: {str(e)}")
        raise


def init_db():
    """Initialize the database with tables."""
    create_tables()
