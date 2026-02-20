# Smart Healthcare System - Backend API

FastAPI backend for Smart Healthcare System with PostgreSQL database.

## Prerequisites

- Python 3.10+
- PostgreSQL 12+
- pip (Python package manager)

## Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Create PostgreSQL Database

#### Option A: Local PostgreSQL Installation
```bash
# Connect to PostgreSQL
psql -U postgres

# Inside psql prompt, create database
CREATE DATABASE smart_healthcare;

# Exit psql
\q
```

#### Option B: Using Docker (Recommended)
```bash
# Start PostgreSQL in Docker
docker run --name smart_healthcare_db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=smart_healthcare \
  -p 5432:5432 \
  -d postgres:15-alpine
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
# Application Configuration
DEBUG=True
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_healthcare
DB_USER=postgres
DB_PASSWORD=postgres

# JWT Configuration
SECRET_KEY=your-super-secret-key-change-in-production-min-32-chars
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Logging
LOG_LEVEL=INFO
```

### 4. Start the FastAPI Server

#### Development Mode (with auto-reload):
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### Production Mode (multi-worker):
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Using the batch script (Windows):
```bash
run_server.bat
```

#### Using the shell script (Linux/Mac):
```bash
bash run_server.sh
```

### 5. Access the API

Once the server is running:

- **API Documentation (Swagger UI):** http://localhost:8000/docs
- **Alternative Documentation (ReDoc):** http://localhost:8000/redoc
- **Health Check:** http://localhost:8000/health
- **API Base URL:** http://localhost:8000

## Docker Setup (Optional)

### Using Docker Compose (Recommended)

```bash
cd backend

# Start both PostgreSQL and API
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f
```

### Using Individual Docker Commands

```bash
# Build the API image
docker build -t smart-healthcare-api .

# Run PostgreSQL
docker run --name smart_healthcare_db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=smart_healthcare \
  -p 5432:5432 \
  -d postgres:15-alpine

# Run API
docker run -p 8000:8000 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=smart_healthcare \
  smart-healthcare-api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - Logout

### Patients
- `POST /api/patients` - Create patient (Admin)
- `GET /api/patients` - List all patients (Doctor)
- `GET /api/patients/{id}` - Get patient details
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient (Admin)

### Doctors
- `POST /api/doctors` - Create doctor (Admin)
- `GET /api/doctors` - List doctors (with filters)
- `GET /api/doctors/{id}` - Get doctor details
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor (Admin)

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/my/appointments` - Get my appointments (Patient)
- `GET /api/appointments/doctor/schedule` - Get doctor schedule
- `GET /api/appointments` - List all appointments
- `GET /api/appointments/{id}` - Get appointment details
- `PUT /api/appointments/{id}` - Update appointment
- `POST /api/appointments/{id}/cancel` - Cancel appointment
- `DELETE /api/appointments/{id}` - Delete appointment

### Billing
- `POST /api/billing` - Create billing record (Admin)
- `GET /api/billing` - List all billing (Admin)
- `GET /api/billing/patient/invoice` - Get my invoices (Patient)
- `GET /api/billing/{id}` - Get billing details
- `PUT /api/billing/{id}` - Update billing (Admin)
- `POST /api/billing/{id}/pay` - Process payment
- `DELETE /api/billing/{id}` - Delete billing (Admin)

### Notifications
- `POST /api/notifications` - Create notification
- `GET /api/notifications` - Get my notifications
- `GET /api/notifications/{id}` - Get notification
- `GET /api/notifications/unread/count` - Get unread count
- `PUT /api/notifications/{id}/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read
- `DELETE /api/notifications/{id}` - Delete notification
- `DELETE /api/notifications` - Delete all notifications

## Testing

### Test with cURL

```bash
# Register
curl -X POST "http://localhost:8000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "username": "patient1",
    "full_name": "John Patient",
    "password": "SecurePass123!",
    "confirm_password": "SecurePass123!"
  }'

# Login
curl -X POST "http://localhost:8000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@example.com",
    "password": "SecurePass123!"
  }'

# Get current user (use token from login)
curl -X GET "http://localhost:8000/api/auth/me" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test with Postman

1. Import the API endpoints into Postman
2. Use the Swagger documentation from http://localhost:8000/docs
3. Copy tokens from login response for authenticated requests

## Database Migrations

```bash
# Initialize Alembic (one-time)
alembic init migrations

# Create a migration
alembic revision --autogenerate -m "Add users table"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in command
uvicorn app.main:app --port 8001
```

### Database Connection Error
- Verify PostgreSQL is running
- Check credentials in `.env` file
- Ensure database exists: `psql -U postgres -l`

### Module Not Found
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Permission Denied (run_server.sh)
```bash
chmod +x run_server.sh
./run_server.sh
```

## Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| DEBUG | bool | False | Enable debug mode |
| ENVIRONMENT | str | development | Environment type |
| HOST | str | 0.0.0.0 | Server host |
| PORT | int | 8000 | Server port |
| DB_HOST | str | localhost | Database host |
| DB_PORT | int | 5432 | Database port |
| DB_NAME | str | smart_healthcare | Database name |
| DB_USER | str | postgres | Database user |
| DB_PASSWORD | str | password | Database password |
| SECRET_KEY | str | - | JWT secret key (required) |
| ACCESS_TOKEN_EXPIRE_MINUTES | int | 30 | Access token expiry |
| REFRESH_TOKEN_EXPIRE_DAYS | int | 7 | Refresh token expiry |
| LOG_LEVEL | str | INFO | Logging level |

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app factory
│   ├── config.py               # Configuration settings
│   ├── database.py             # Database connection
│   ├── models/                 # SQLAlchemy models
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── doctor.py
│   │   ├── appointment.py
│   │   ├── medical_record.py
│   │   ├── prescription.py
│   │   ├── billing.py
│   │   └── notification.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── auth.py
│   │   ├── patient.py
│   │   ├── doctor.py
│   │   ├── appointment.py
│   │   ├── billing.py
│   │   └── notification.py
│   ├── routes/                 # API endpoints
│   │   ├── auth.py
│   │   ├── patient.py
│   │   ├── doctor.py
│   │   ├── appointment.py
│   │   ├── billing.py
│   │   └── notification.py
│   ├── services/               # Business logic
│   │   ├── patient_service.py
│   │   ├── doctor_service.py
│   │   ├── appointment_service.py
│   │   ├── billing_service.py
│   │   └── notification_service.py
│   └── auth/                   # Authentication
│       ├── password.py
│       ├── jwt_handler.py
│       └── dependencies.py
├── .env                        # Environment variables
├── requirements.txt            # Python dependencies
├── Dockerfile                  # Docker image
├── docker-compose.yml          # Docker Compose config
├── run_server.bat              # Windows launcher
└── run_server.sh               # Linux/Mac launcher
```

## License

Proprietary - Smart Healthcare System
