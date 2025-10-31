# MERN ThinkBoard API Documentation

## Overview
A full-stack note-taking application built with MongoDB, Express.js, React, and Node.js.

## Project Structure
```
MERN-THINKBOARD/
├── backend/
│   ├── src/
│   │   ├── controller/
│   │   ├── Middleware/
│   │   ├── model/
│   │   ├── routes/
│   │   └── server.js
│   └── config/
└── frontend/
```

## Setup & Installation

### Backend Setup
```bash
cd backend
npm install
npm start
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Base URL
```
http://localhost:3000/api
```

## Authentication APIs

### 1. User Signup
**POST** `/auth/signup`

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
    "email": "test@example.com"
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
**POST** `/auth/login`

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

### 3. Verify Token
**GET** `/auth/verify`

**Headers:**
```
Authorization: Bearer <token>
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

## Notes APIs
*All notes APIs require authentication token in Authorization header*

### 1. Get All Notes
**GET** `/notes`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "notes": [
    {
      "_id": "note_id",
      "title": "Note Title",
      "content": "Note content",
      "userId": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Note by ID
**GET** `/notes/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "note": {
    "_id": "note_id",
    "title": "Note Title",
    "content": "Note content",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create Note
**POST** `/notes`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Note Title",
  "content": "Note content here"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "Note created successfully",
  "note": {
    "_id": "note_id",
    "title": "New Note Title",
    "content": "Note content here",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update Note
**PUT** `/notes/:id`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Note Title",
  "content": "Updated note content"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Note updated successfully",
  "note": {
    "_id": "note_id",
    "title": "Updated Note Title",
    "content": "Updated note content",
    "userId": "user_id",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 5. Delete Note
**DELETE** `/notes/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Note deleted successfully"
}
```

## API Testing Examples

### Using cURL

#### 1. Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

#### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### 3. Create Note
```bash
curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Test Note","content":"This is a test note"}'
```

#### 4. Get All Notes
```bash
curl -X GET http://localhost:3000/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### 5. Update Note
```bash
curl -X PUT http://localhost:3000/api/notes/NOTE_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"title":"Updated Title","content":"Updated content"}'
```

#### 6. Delete Note
```bash
curl -X DELETE http://localhost:3000/api/notes/NOTE_ID \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Authentication Flow

1. **User Registration**: POST `/auth/signup` with user details
2. **User Login**: POST `/auth/login` with email/password
3. **Receive Token**: Server returns JWT token
4. **Access Protected Routes**: Include token in Authorization header
5. **Token Verification**: Server validates token for each protected request

## Error Responses

### Common Error Codes
- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Missing or invalid token
- **404**: Not Found - Resource not found
- **500**: Internal Server Error - Server error

### Error Response Format
```json
{
  "message": "Error description",
  "success": false
}
```

## Environment Variables

Create `.env` file in backend directory:
```env
MONGO_URI=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React.js
- Vite
- Tailwind CSS

## Development Notes

- Server runs on port 3000 by default
- Frontend development server runs on port 5173
- CORS is enabled for development
- JWT tokens expire in 3 days
- All notes APIs require authentication
- Passwords are hashed using bcrypt

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Build frontend: `npm run build`
3. Server will serve static files from `frontend/dist`
4. Update CORS settings for production domain