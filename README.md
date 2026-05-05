# Klavora - Pharmacy Inventory Management System

A modern, full-stack pharmacy inventory management system built with React, Node.js, PostgreSQL, and Material-UI.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start Guide](#quick-start-guide)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Database Configuration](#database-configuration)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Features](#features)
- [Running in Production](#running-in-production)
- [Troubleshooting](#troubleshooting)
- [Security Considerations](#security-considerations)
- [License](#license)

---

## Overview

Klavora is a comprehensive pharmacy inventory management system that enables pharmacies to:

- Manage inventory items and batches
- Track stock levels with low-stock alerts
- Process sales and purchases
- Generate reports and analytics
- Manage multiple staff users with role-based access
- Monitor expiry dates and alert for expiring items

---

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Build tool
- **Material-UI (MUI)** - UI Component library
- **Axios** - HTTP client
- **React Context** - State management

### Backend
- **Node.js 20** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Language
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Redis** - Cache & session store
- **JWT** - Authentication
- **node-cron** - Background jobs

---

## Project Structure

```
klavora/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── api/           # API client & endpoints
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   ├── styles/        # Theme & styles
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # App entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                # Node.js backend API
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── controllers/  # Route handlers
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Express middleware
│   │   ├── errors/        # Error classes
│   │   ├── libs/          # Utilities (Prisma, Redis, JWT, Mail, S3)
│   │   ├── jobs/          # Background cron jobs
│   │   ├── types/         # TypeScript types
│   │   ├── app.ts         # Express app
│   │   └── server.ts      # Server entry point
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── seed.ts        # Database seeder
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── docker-compose.yml
│
└── README.md
```

---

## Prerequisites

Before running the project, ensure you have installed:

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **PostgreSQL 16+** - [Download](https://www.postgresql.org/download/)
3. **Redis 7+** (optional for development) - [Download](https://redis.io/download/)
4. **Git** - [Download](https://git-scm.com/)

---

## Quick Start Guide

### Option 1: Docker (Recommended for Easy Setup)

```bash
# 1. Clone the repository
git clone <repository-url>
cd klavora

# 2. Start backend with Docker
cd backend
docker-compose up -d

# 3. Run database migrations
npm run prisma:generate
npm run prisma db push
npm run prisma:seed

# 4. Start frontend
cd ..
npm run dev
```

### Option 2: Manual Setup

Follow the detailed instructions below.

---

## Backend Setup

### 1. Navigate to Backend Directory

```bash
cd backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000
API_BASE_URL=http://localhost:3000
FRONTEND_URL=http://localhost:5173

# Database (UPDATE THIS)
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/klavora_db

# Redis (UPDATE THIS)
REDIS_URL=redis://localhost:6379

# JWT Secrets (CHANGE THESE TO RANDOM STRINGS)
JWT_ACCESS_SECRET=your-32-character-minimum-secret-key-here
JWT_REFRESH_SECRET=your-different-32-character-secret-key-here

# Email (Optional - for password reset, alerts)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
EMAIL_FROM=noreply@klavora.com

# File Storage
STORAGE_DRIVER=local
AWS_S3_BUCKET=klavora-uploads
AWS_REGION=us-east-1
```

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Set Up Database

```bash
# Push schema to database
npm run prisma db push

# OR run migrations
npm run prisma:migrate
```

### 6. Seed Database (Optional - creates demo data)

```bash
npm run prisma:seed
```

### 7. Start the Backend Server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

---

## Frontend Setup

### 1. Navigate to Root Directory

```bash
cd ..
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 4. Start the Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

---

## Database Configuration

### Using PostgreSQL Locally

1. Install PostgreSQL from https://www.postgresql.org/download/windows/
2. During installation, set password for `postgres` user
3. Create a database named `klavora_db`

```bash
psql -U postgres -c "CREATE DATABASE klavora_db;"
```

### Using Docker

```bash
# Start PostgreSQL container
docker run -d --name klavora-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=klavora_db \
  -p 5432:5432 \
  postgres:16-alpine
```

---

## Environment Variables

### Backend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment (development/production) | No | `development` |
| `PORT` | Server port | No | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `REDIS_URL` | Redis connection string | No | `redis://localhost:6379` |
| `JWT_ACCESS_SECRET` | JWT access token secret (min 32 chars) | Yes | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret (min 32 chars) | Yes | - |
| `SMTP_HOST` | Email SMTP server | No | - |
| `SMTP_PORT` | SMTP port | No | `587` |
| `SMTP_USER` | SMTP username | No | - |
| `SMTP_PASS` | SMTP password | No | - |
| `EMAIL_FROM` | From email address | No | `noreply@klavora.com` |
| `STORAGE_DRIVER` | File storage (local/s3) | No | `local` |
| `AWS_S3_BUCKET` | AWS S3 bucket name | No | - |
| `AWS_REGION` | AWS region | No | `us-east-1` |

### Frontend (.env)

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API base URL | Yes | `http://localhost:3000/api/v1` |

---

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication

All protected routes require a JWT access token in the Authorization header:

```
Authorization: Bearer <access_token>
```

#### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@klavora.com",
  "password": "admin123"
}
```

#### Response
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1..."
  }
}
```

### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| **Auth** | | | |
| POST | /auth/register | Register new pharmacy | Public |
| POST | /auth/login | User login | Public |
| POST | /auth/refresh | Refresh token | Public |
| POST | /auth/logout | User logout | Required |
| GET | /auth/me | Get current user | Required |
| **Users** | | | |
| GET | /users | List all users | Admin |
| POST | /users | Create new user | Admin |
| GET | /users/:id | Get user details | Admin |
| PUT | /users/:id | Update user | Admin |
| **Inventory** | | | |
| GET | /inventory | List inventory items | Required |
| POST | /inventory | Create item | Pharmacist+ |
| GET | /inventory/:id | Get item details | Required |
| PUT | /inventory/:id | Update item | Pharmacist+ |
| GET | /inventory/low-stock | Get low stock items | Required |
| GET | /inventory/expiring-soon | Get expiring batches | Required |
| **Transactions** | | | |
| GET | /transactions | List transactions | Required |
| POST | /transactions | Create transaction | Cashier+ |
| GET | /transactions/:id | Get transaction | Required |
| **Dashboard** | | | |
| GET | /dashboard/stats | Get dashboard statistics | Required |
| GET | /dashboard/sales-chart | Get sales chart data | Required |
| GET | /dashboard/top-products | Get top products | Required |
| **Alerts** | | | |
| GET | /alerts | List alerts | Required |
| GET | /alerts/unread-count | Get unread count | Required |
| PATCH | /alerts/:id/read | Mark as read | Required |
| **Reports** | | | |
| GET | /reports/sales | Sales report | Admin/Pharmacist |
| GET | /reports/inventory | Inventory report | Admin/Pharmacist |

### User Roles

| Role | Permissions |
|------|-------------|
| ADMIN | Full access to all features |
| PHARMACIST | Manage inventory, process transactions, view reports |
| CASHIER | Process sales transactions only |
| VIEWER | Read-only access to inventory and dashboard |

---

## Features

### Inventory Management
- Add, edit, and delete inventory items
- Track item batches with expiry dates
- Low stock alerts
- Expiry tracking and alerts
- SKU and barcode support

### Transaction Processing
- Sales (POS)
- Purchases (Restocking)
- Returns
- Stock adjustments
- Automatic stock deduction (FEFO)

### Dashboard & Analytics
- Real-time statistics
- Sales charts
- Top products
- Low stock alerts
- Expiry alerts

### User Management
- Role-based access control
- Staff user management
- Password reset functionality

### Background Jobs
- **Low Stock Scanner** - Runs hourly to check stock levels
- **Expiry Checker** - Runs daily to check for expiring items
- **Report Aggregator** - Runs daily to aggregate sales data

---

## Running in Production

### Backend

1. **Build the project:**
```bash
cd backend
npm run build
```

2. **Set environment variables:**
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_ACCESS_SECRET=<random-64-char-string>
JWT_REFRESH_SECRET=<random-64-char-string>
```

3. **Run migrations:**
```bash
npx prisma migrate deploy
```

4. **Start server:**
```bash
npm start
```

### Frontend

1. **Build for production:**
```bash
npm run build
```

2. **Serve the build:**
```bash
npm run preview
# or deploy to Netlify, Vercel, etc.
```

### Using Docker

```bash
# Build and run
cd backend
docker-compose -f docker-compose.yml up -d
```

---

## Troubleshooting

### Backend Issues

**"Authentication failed" error**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Verify username and password

**"Module not found" errors**
```bash
npm run prisma:generate
```

**Redis connection failed**
- Redis is optional for development
- App will work without Redis (some features limited)

### Frontend Issues

**"Axios not found"**
```bash
npm install axios
```

**Blank page**
- Check browser console for errors
- Try clearing browser cache
- Ensure backend is running on port 3000

---

## Security Considerations

1. **Change default JWT secrets** in production
2. **Use HTTPS** in production
3. **Secure database credentials**
4. **Enable CORS** restrictions for production
5. **Regularly update dependencies**
6. **Use strong passwords**
7. **Enable database backups**

---

## Default Login Credentials

After running `npm run prisma:seed`:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@klavora.com | admin123 |
| Pharmacist | pharmacist@klavora.com | admin123 |
| Cashier | cashier@klavora.com | admin123 |

---

## License

Proprietary - Klavora Pharmacy System

---

## Support

For issues or questions, please contact the development team.