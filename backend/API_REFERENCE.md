# Klavora API Reference

Base URL: `http://localhost:3000/api/v1`

---

## Authentication

### Login
```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "admin@klavora.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

### Register
```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "newadmin@klavora.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "pharmacyName": "My Pharmacy",
  "licenseNumber": "PHARM-2024-001",
  "address": "123 Main Street",
  "phone": "+2348012345678",
  "pharmacyEmail": "pharmacy@example.com"
}
```

---

### Get Current User
```
GET /auth/me
```

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "userId": "uuid",
    "email": "admin@klavora.com",
    "role": "ADMIN",
    "pharmacyId": "uuid"
  }
}
```

---

## Inventory

### List Items
```
GET /inventory
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search term
- `category` - Filter by category
- `sortBy` - Sort field
- `sortOrder` - asc/desc

**Response (200):**
```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

### Create Item
```
POST /inventory
```

**Request Body:**
```json
{
  "name": "Paracetamol 500mg",
  "sku": "PARA-500",
  "category": "Pain Relief",
  "unitPrice": 150.00,
  "costPrice": 100.00,
  "reorderLevel": 50,
  "unit": "tablet",
  "description": "Pain reliever and fever reducer"
}
```

### Get Item
```
GET /inventory/:id
```

### Update Item
```
PUT /inventory/:id
```

### Add Batch (Receive Stock)
```
POST /inventory/:id/batches
```

**Request Body:**
```json
{
  "batchNumber": "BATCH-001",
  "expiryDate": "2027-05-01",
  "quantity": 100,
  "costPrice": 100.00,
  "supplierName": "PharmaCorp",
  "notes": "Stored in cool dry place"
}
```

### Adjust Stock
```
POST /inventory/:id/adjust
```

**Request Body:**
```json
{
  "adjustmentType": "DECREASE",
  "quantity": 5,
  "reason": "Damaged in storage",
  "batchId": "optional-batch-uuid"
}
```

---

## Transactions

### Create Sale
```
POST /transactions
```

**Request Body:**
```json
{
  "type": "SALE",
  "items": [
    {
      "inventoryItemId": "uuid",
      "quantity": 2,
      "unitPrice": 150.00,
      "costPrice": 100.00
    }
  ],
  "paymentMethod": "CASH",
  "customerName": "John Doe",
  "customerPhone": "+2348012345678"
}
```

### List Transactions
```
GET /transactions
```

**Query Parameters:**
- `page`, `limit`
- `type` - SALE, PURCHASE, RETURN, ADJUSTMENT
- `status` - PENDING, PAID, VOIDED
- `dateFrom`, `dateTo` - Date range
- `userId` - Filter by user

---

## Dashboard

### Get Stats
```
GET /dashboard/stats
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalItems": 45,
    "totalInventoryValue": 250000,
    "totalRetailValue": 350000,
    "todaySales": 12500,
    "todayTransactions": 25,
    "unreadAlerts": 3,
    "lowStockCount": 2,
    "outOfStockCount": 0
  }
}
```

### Get Sales Chart
```
GET /dashboard/sales-chart
```

**Query Parameters:**
- `dateFrom` - Start date (YYYY-MM-DD)
- `dateTo` - End date (YYYY-MM-DD)

### Get Top Products
```
GET /dashboard/top-products
```

**Query Parameters:**
- `limit` - Number of products (default: 10)
- `sortBy` - quantity or revenue

---

## Alerts

### List Alerts
```
GET /alerts
```

**Query Parameters:**
- `type` - LOW_STOCK, OUT_OF_STOCK, EXPIRY_APPROACHING, EXPIRED
- `severity` - INFO, WARNING, CRITICAL
- `status` - UNREAD, READ, RESOLVED

### Mark as Read
```
PATCH /alerts/:id/read
```

### Resolve Alert
```
PATCH /alerts/:id/resolve
```

---

## Users (Admin Only)

### List Users
```
GET /users
```

### Create User
```
POST /users
```

**Request Body:**
```json
{
  "email": "newuser@klavora.com",
  "password": "password123",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "CASHIER",
  "phone": "+2348012345678"
}
```

### Update User
```
PUT /users/:id
```

---

## Common Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "error": {
    "code": "AUTHENTICATION_ERROR",
    "message": "Invalid token"
  }
}
```

### 403 Forbidden
```json
{
  "success": false,
  "error": {
    "code": "AUTHORIZATION_ERROR",
    "message": "Access denied"
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Inventory item not found"
  }
}
```

### 422 Validation Error
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "path": "email", "message": "Invalid email format" }
    ]
  }
}
```

---

## Rate Limits

- **General:** 200 requests per 15 minutes
- **Auth:** 10 requests per 15 minutes

---

## Response Envelope

All responses follow this format:

```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

Paginated responses:

```json
{
  "success": true,
  "data": {
    "items": [...],
    "pagination": { ... }
  }
}
```