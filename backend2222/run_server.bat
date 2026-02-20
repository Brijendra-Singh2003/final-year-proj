@echo off
REM Smart Healthcare System - FastAPI Server Launcher

echo.
echo ========================================
echo Smart Healthcare System API
echo ========================================
echo.

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo Please create .env file with database credentials
    pause
    exit /b 1
)

REM Check Python installation
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    pause
    exit /b 1
)

REM Check pip packages
echo Checking dependencies...
pip list | findstr "fastapi uvicorn sqlalchemy" >nul
if errorlevel 1 (
    echo Installing required packages...
    pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose passlib[bcrypt] python-multipart
)

REM Start the server
echo.
echo Starting FastAPI Server...
echo Server running at: http://localhost:8000
echo Documentation at: http://localhost:8000/docs
echo.
echo Press Ctrl+C to stop
echo.

uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

pause
