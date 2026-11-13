# AirBooking – Flight Booking Platform

A full-stack flight booking application developed using React, Django REST Framework, and MySQL.

## Project Overview

AirBooking is a web-based flight booking platform that allows users to register, search for flights, book tickets, manage reservations, and track live flight information.

The platform also includes an administrative dashboard with user approval, flight management, and booking statistics.

## Technologies Used

### Frontend
- React.js
- Vite
- JavaScript
- HTML5
- CSS3
- Axios
- React Router
- Lucide React

### Backend
- Python
- Django
- Django REST Framework
- MySQL
- JWT Authentication
- Celery
- Redis

### External Services
- OpenSky Network – Live aircraft information
- Gmail SMTP – Account approval email notifications

## Main Features

### User Features
- User registration and login
- Admin approval-based account access
- Flight search
- Flight booking
- Payment simulation
- Downloadable PDF e-ticket
- My Trips
- Booking management
- Booking cancellation
- Live flight status

### Admin Features
- Admin dashboard
- User approval and rejection
- Flight management
- Flight status management
- Booking management
- Booking statistics and revenue overview

## Project Structure

```text
AirBooking/
├── backend/
│   ├── accounts/
│   ├── bookings/
│   ├── config/
│   ├── flights/
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── package-lock.json
│
└── README.md
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd AirBooking
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

Windows:

```powershell
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file inside the backend folder and configure:

```env
SECRET_KEY=your_django_secret_key
DEBUG=True

DB_NAME=airbooking_db
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_HOST=127.0.0.1
DB_PORT=3306

EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_gmail_app_password
```

Configure your MySQL database before running migrations.

### 4. Database Migration

```bash
python manage.py makemigrations
python manage.py migrate
```

Create an admin account:

```bash
python manage.py createsuperuser
```

### 5. Start Redis and Celery

Ensure Redis is running.

In a separate terminal, activate the backend virtual environment and run:

```bash
celery -A config worker -l info --pool=solo
```

### 6. Start Django Backend

```bash
python manage.py runserver
```

Backend URL:

`http://127.0.0.1:8000/`

Django Admin:

`http://127.0.0.1:8000/admin/`

### 7. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

`http://localhost:5173/`

## Authentication

The application uses JWT authentication and an admin approval workflow. Newly registered users remain pending until an administrator approves their accounts.

## Live Flight Information

Live aircraft information is retrieved from the OpenSky Network API.

## Developer

Developed as a Full Stack Engineer take-home assignment for YUAI Soft Solutions Pvt. Ltd.

## Project Demo Video

Watch the complete AirBooking project demonstration:

[▶ Watch AirBooking Project Demo](https://drive.google.com/file/d/1-f7ctWEI0CU-zXZu1z8jbXZOy6afTYEO/view?usp=sharing)

## Project Screenshots

The screenshots folder contains the application's user interface and feature demonstrations.