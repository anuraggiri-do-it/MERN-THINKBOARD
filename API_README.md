# MERN ThinkBoard API Documentation

## Server Management

### Check if server is running:
```bash
netstat -ano | findstr :3000
```

### Kill existing server process:
```bash
# Find the PID from netstat output, then:
taskkill /PID <PID_NUMBER> /F
```

### Start development server:
```bash
npm run dev
```

## Base URL
```
http://localhost:3000
```

## Authentication Flow

### 1. User Registration
**Endpoint:** `POST /api/auth/signup`

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "message": "User created successfully",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "username": "testuser",
    "email": "test@example.com",
    "createdAt": "2025-01-01T00:00:00.000Z"
  }
}
```

**Error Response (400):**
```json
{
  "message": "User already exists"
}
```

### 2. User Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

**Error Responses:**
```json
// User not found (400)
{
  "message": "User not found"
}

// Wrong password (400)
{
  "message": "Incorrect password"
}
```

### 3. Token Verification
**Endpoint:** `GET /api/auth/verify`

**Headers:**
```
Authorization: Bearer <your_jwt_token>
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "user_id",
    "username": "testuser",
    "email": "test@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "message": "Access denied. No token provided."
}
```

## Notes Management (Protected Routes)

All notes endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get note by ID
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

## API Testing

### Signup:
```bash
curl -X POST http://localhost:3000/api/auth/signup -H "Content-Type: application/json" -d "{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

### Verify Token:
```bash
curl -X GET http://localhost:3000/api/auth/verify -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Authentication Flow

1. **Signup/Login** → Get JWT token
2. **Store token** → Use in Authorization header
3. **Access protected routes** → Notes CRUD operations

## Quick Setup

1. Install dependencies: `npm install`
2. Set environment variables (.env)
3. Start server: `npm run dev`
4. Test APIs using cURL commands above