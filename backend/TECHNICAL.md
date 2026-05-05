# Klavora Backend - Technical Documentation

## Overview

The Klavora backend is a RESTful API built with Node.js, Express, and TypeScript. It provides the business logic and data management for the pharmacy inventory management system.

---

## Architecture

### Layer Structure

```
┌─────────────────────────────────────────────┐
│           Express Routes                   │
│         (src/routes/*.routes.ts)           │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────┴───────────────────────────┐
│           Controllers                       │
│        (src/controllers/*.ts)              │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────┴───────────────────────────┐
│            Services                         │
│        (src/services/*.service.ts)         │
└─────────────────┬───────────────────────────┘
                  │
┌─────────────────┴───────────────────────────┐
│    Prisma ORM / Redis / External APIs      │
└─────────────────────────────────────────────┘
```

### Key Components

1. **Routes** - Define API endpoints and apply middleware
2. **Controllers** - Handle HTTP requests/responses
3. **Services** - Contain business logic
4. **Prisma** - Database ORM
5. **Redis** - Caching and session management

---

## Database Schema

### Core Entities

- **User** - Staff members with roles (ADMIN, PHARMACIST, CASHIER, VIEWER)
- **Pharmacy** - The pharmacy organization
- **InventoryItem** - Products/drugs
- **InventoryBatch** - Stock batches with expiry dates
- **Transaction** - Sales, purchases, returns, adjustments
- **TransactionItem** - Line items in transactions
- **Alert** - Low stock and expiry alerts
- **AuditLog** - Record of all actions

### Key Relationships

```
Pharmacy
  ├── Users (many)
  ├── InventoryItems (many)
  │   └── InventoryBatches (many)
  ├── Transactions (many)
  │   └── TransactionItems (many)
  ├── Alerts (many)
  └── AuditLogs (many)
```

---

## Authentication Flow

### Login Process

```
1. Client sends POST /auth/login with email/password
2. Server validates credentials against database
3. Server generates JWT access token (15 min) and refresh token (7 days)
4. Server stores refresh token hash in Redis
5. Access token returned to client, refresh token as HttpOnly cookie
6. Client stores access token in memory
```

### Token Refresh

```
1. Client's access token expires
2. Client sends POST /auth/refresh with refresh token cookie
3. Server validates refresh token against Redis
4. Server issues new token pair (token rotation)
5. Old refresh token deleted from Redis
```

### Logout

```
1. Client sends POST /auth/logout
2. Server deletes refresh token from Redis
3. Server increments user's refreshTokenVersion (invalidates all tokens)
```

---

## Business Logic

### Stock Management (FEFO)

The system uses First Expiry First Out (FEFO) for stock deduction:

1. When a sale is made, batches are sorted by expiry date
2. Stock is deducted from oldest batches first
3. If a batch runs out, move to next oldest
4. Transaction items record which batch each quantity came from

### Stock Adjustment

Manual stock adjustments require:
- `adjustmentType`: INCREASE or DECREASE
- `quantity`: Amount to adjust
- `reason`: Mandatory reason (damage, count correction, etc.)
- `batchId`: Optional - specific batch to adjust

### Low Stock Alerts

Two ways alerts are generated:
1. **Event-driven** - After every transaction, check affected items
2. **Scheduled** - Cron job runs hourly to scan all items

### Expiry Alerts

Daily cron job checks batches expiring within configured window (default 90 days) and creates alerts.

---

## API Endpoints Summary

### Authentication (`/api/v1/auth`)
- POST /register - Register pharmacy and admin
- POST /login - User login
- POST /refresh - Refresh access token
- POST /logout - User logout
- POST /forgot-password - Request password reset
- POST /reset-password - Complete password reset
- GET /me - Get current user info

### Users (`/api/v1/users`)
- GET / - List users (Admin)
- POST / - Create user (Admin)
- GET /:id - Get user (Admin)
- PUT /:id - Update user (Admin)
- PATCH /:id/deactivate - Deactivate user (Admin)
- PATCH /:id/activate - Activate user (Admin)
- PUT /me/password - Change own password

### Inventory (`/api/v1/inventory`)
- GET / - List items
- POST / - Create item (Pharmacist+)
- GET /:id - Get item details
- PUT /:id - Update item (Pharmacist+)
- PATCH /:id/deactivate - Deactivate item (Admin)
- GET /low-stock - Get low stock items
- GET /expiring-soon - Get expiring batches
- GET /search - Search items
- GET /:id/batches - Get item batches
- POST /:id/batches - Add new batch (Pharmacist+)
- POST /:id/adjust - Manual stock adjustment (Pharmacist+)

### Transactions (`/api/v1/transactions`)
- GET / - List transactions
- POST / - Create transaction (Cashier+)
- GET /:id - Get transaction details
- GET /recent - Recent transactions
- PATCH /:id/payment - Update payment status (Cashier+)
- POST /:id/void - Void transaction (Admin)

### Dashboard (`/api/v1/dashboard`)
- GET /stats - Dashboard statistics
- GET /sales-chart - Sales chart data
- GET /top-products - Top selling products
- GET /recent-transactions - Recent transactions

### Alerts (`/api/v1/alerts`)
- GET / - List alerts
- GET /unread-count - Unread count
- PATCH /:id/read - Mark as read
- POST /read-all - Mark all as read
- PATCH /:id/resolve - Resolve alert (Pharmacist+)

### Reports (`/api/v1/reports`)
- GET /sales - Sales report
- GET /inventory - Inventory report
- GET /expiry - Expiry report
- GET /profit-loss - Profit & loss report

---

## Middleware Pipeline

Every request passes through:

1. **CORS** - Allow requests from configured frontend
2. **Helmet** - Security headers
3. **Rate Limiter** - Prevent abuse
4. **Morgan** - HTTP logging
5. **Express.json** - Parse request body
6. **Auth** - Verify JWT token
7. **RBAC** - Check user role
8. **Validation** - Validate request with Zod
9. **Route Handler** - Execute controller
10. **Error Handler** - Catch and format errors

---

## Background Jobs

### Low Stock Scanner
- Schedule: Every hour (`0 * * * *`)
- Checks all inventory items for low stock
- Creates/resolves alerts automatically
- Sends email to admins

### Expiry Checker
- Schedule: Daily at 00:30 UTC (`30 0 * * *`)
- Checks batches expiring within 90 days
- Creates EXPIRY_APPROACHING alerts
- Creates EXPIRED alerts and deactivates batches
- Sends email digest to admins and pharmacists

### Report Aggregator
- Schedule: Daily at 01:00 UTC (`0 1 * * *`)
- Aggregates previous day's sales data
- Stores in reports table
- Invalidates dashboard cache

---

## Error Handling

### Error Classes

- `AppError` - Base error class
- `ValidationError` - 422 - Zod validation failures
- `AuthenticationError` - 401 - Invalid/missing token
- `AuthorizationError` - 403 - Insufficient permissions
- `NotFoundError` - 404 - Resource not found
- `ConflictError` - 409 - Duplicate entry
- `BusinessError` - 422 - Business rule violations

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": [] // Optional validation errors
  }
}
```

---

## Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `REDIS_URL` | Redis connection string | No |
| `JWT_ACCESS_SECRET` | Access token signing key | Yes |
| `JWT_REFRESH_SECRET` | Refresh token signing key | Yes |
| `SMTP_*` | Email configuration | No |
| `AWS_*` | S3 configuration | No |

---

## Testing

### Run Tests
```bash
npm test
npm run test:unit
npm run test:integration
npm run test:coverage
```

### Test Coverage Requirements
- Minimum 80% line coverage
- 100% on auth service, RBAC, stock logic, transactions

---

## Deployment

### Docker

```bash
# Development
docker-compose -f docker-compose.dev.yml up -d

# Production
docker build -t klavora-backend .
docker run -d -p 3000:3000 --env-file .env klavora-backend
```

### Manual

```bash
# Build
npm run build

# Migrate
npx prisma migrate deploy

# Start
npm start
```

---

## External Integrations

### Email (SMTP)
- Used for: password reset, low stock alerts, expiry alerts
- Supports any SMTP provider (SendGrid, Mailgun, etc.)

### AWS S3 (Optional)
- Used for: pharmacy logos, receipts, exported files
- Can be disabled for local storage

---

## Performance Considerations

1. **Redis Caching** - Dashboard stats cached for 5 minutes
2. **Database Indexes** - Added on frequently queried columns
3. **Prisma Query Optimization** - Use `select` to limit fields
4. **Connection Pooling** - Prisma handles automatically

---

## Security

1. **Password Hashing** - bcrypt with 12 rounds
2. **JWT Tokens** - Short-lived (15 min access, 7 day refresh)
3. **Token Rotation** - New refresh token on each use
4. **Rate Limiting** - 200 req/15min general, 10 req/15min auth
5. **Input Validation** - Zod schemas on all endpoints
6. **RBAC** - Role-based access control on all routes
7. **Audit Logging** - All changes logged to audit_logs table