# 🏍️ BikeRent - Premium Bike Rental Application

A modern, production-ready bike rental web application built with React + FastAPI + MySQL.

## Tech Stack

**Frontend:** React 18, Vite, TailwindCSS, Framer Motion, React Router DOM, Axios  
**Backend:** FastAPI, SQLAlchemy, PyMySQL  
**Database:** MySQL  
**Auth:** JWT (Bearer Token)

## Features

- 🏠 Beautiful responsive home page with hero section
- 🏍️ Browse bikes with filters (brand, price, search)
- 📄 Detailed bike view with image gallery
- 🔐 User authentication (login/signup)
- ➕ Add/Edit/Delete bikes (all users can manage bikes)
- 📷 Multiple image upload support
- 📱 Fully responsive design
- ✨ Smooth animations with Framer Motion

## Quick Start

### Backend Setup

```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Configure database in app/core/config.py
# DATABASE_URL = "mysql+pymysql://user:password@localhost:3306/bike_rental"

# Run server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Run dev server
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Register new user |
| POST | /auth/login | Login user |
| GET | /auth/me | Get current user |
| GET | /vehicles | List all bikes (with filters) |
| GET | /vehicles/{id} | Get bike details |
| POST | /vehicles | Create new bike |
| PUT | /vehicles/{id} | Update bike |
| DELETE | /vehicles/{id} | Delete bike |
| POST | /vehicles/{id}/upload-images | Upload bike images |

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy dist folder to Vercel
# Set VITE_API_URL environment variable
```

### Backend → Railway/Render

1. Push code to GitHub
2. Connect to Railway/Render
3. Set environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
4. Deploy

## Project Structure

```
├── app/                    # FastAPI Backend
│   ├── core/              # Config, DB, Security
│   ├── models/            # SQLAlchemy models
│   ├── routers/           # API routes
│   ├── schemas/           # Pydantic schemas
│   └── utils/             # Helpers
├── frontend/              # React Frontend
│   └── src/
│       ├── components/    # Reusable components
│       ├── pages/         # Page components
│       ├── services/      # API services
│       ├── router/        # React Router
│       └── utils/         # Helpers
└── requirements.txt
```
