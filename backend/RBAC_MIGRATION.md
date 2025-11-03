# RBAC Migration Guide - ThinkBoard Backend

## Overview
This document outlines the changes made to migrate from simple authentication to Role-Based Access Control (RBAC) in the ThinkBoard backend.

## Changes Made

### 1. User Model Updates (`src/model/AuthModel.js`)
**Before:**
```javascript
// Incorrect syntax
enum: {
  type: "string",
  enum: ["user", "admin"],
  default: "user"
}
```

**After:**
```javascript
role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}
```

### 2. Notes Model Updates (`src/model/Notes.js`)
**Added user association:**
```javascript
user: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true
}
```

### 3. JWT Token Updates (`src/utils/secretToken.js`)
**Before:**
```javascript
export const createSecretToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
```

**After:**
```javascript
export const createSecretToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });
};
```

### 4. Auth Middleware Updates (`src/Middleware/AuthMiddleware.js`)
**Before:** Database lookup for user data
**After:** Direct use of JWT payload for better performance
```javascript
export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Contains id and role
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
```

### 5. Role Middleware (`src/Middleware/roleMiddleware.js`)
```javascript
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }
  next();
};
```

### 6. Notes Controller Updates (`src/controller/notesController.js`)

#### New Functions:
- **`getAllNotes`**: Admin-only access to all notes
- **`getUserNotes`**: User access to their own notes only

#### Updated Functions:
- **`createNotes`**: Associates notes with authenticated user
- **`getNoteById`**: Ownership validation
- **`updateNotes`**: Ownership validation
- **`deleteNotes`**: Ownership validation

### 7. Routes Structure (`src/routes/notesRoutes.js`)
```javascript
// Admin routes
router.get("/all", verifyToken, verifyAdmin, getAllNotes);

// User routes
router.get("/my", verifyToken, getUserNotes);

// Shared routes with ownership validation
router.get("/:id", verifyToken, getNoteById);
router.post("/", verifyToken, createNotes);
router.put("/:id", verifyToken, updateNotes);
router.delete("/:id", verifyToken, deleteNotes);
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user (default role: "user")
- `POST /auth/login` - Login user

### Notes (User)
- `GET /notes/my` - Get user's own notes
- `GET /notes/:id` - Get specific note (ownership validated)
- `POST /notes` - Create new note (auto-assigned to user)
- `PUT /notes/:id` - Update note (ownership validated)
- `DELETE /notes/:id` - Delete note (ownership validated)

### Notes (Admin)
- `GET /notes/all` - Get all notes from all users

## Security Features

### Ownership Validation
All note operations (except admin `/all`) validate ownership:
```javascript
if (note.user.toString() !== req.user.id && req.user.role !== "admin") {
  return res.status(403).json({ message: "Access denied" });
}
```

### Role-Based Access
- **Users**: Can only access their own notes
- **Admins**: Can access all notes and perform all operations

## Testing with Postman

### 1. Create Admin User
```json
POST /auth/signup
{
  "username": "admin",
  "email": "admin@test.com",
  "password": "password123",
  "role": "admin"
}
```

### 2. Create Regular User
```json
POST /auth/signup
{
  "username": "user1",
  "email": "user1@test.com",
  "password": "password123"
}
```

### 3. Test Scenarios
1. **User creates note** → Should be associated with user
2. **User tries `/notes/all`** → Should get 403 Forbidden
3. **Admin accesses `/notes/all`** → Should see all notes
4. **User tries to access another user's note** → Should get 403 Forbidden
5. **Admin can access any note** → Should work

## Migration Steps for Existing Data

If you have existing data, run these MongoDB commands:

```javascript
// Add default role to existing users
db.users.updateMany(
  { role: { $exists: false } },
  { $set: { role: "user" } }
);

// If you have existing notes without user association, you'll need to:
// 1. Backup your data
// 2. Manually assign notes to users
// 3. Or delete existing notes and start fresh
```

## Environment Variables Required
```
JWT_SECRET=your_jwt_secret_key
MONGODB_URI=your_mongodb_connection_string
```

## Key Benefits of RBAC Implementation

1. **Security**: Users can only access their own data
2. **Scalability**: Easy to add more roles in the future
3. **Performance**: JWT contains role info, reducing database queries
4. **Maintainability**: Clear separation of concerns
5. **Compliance**: Proper access control for data protection

## Future Enhancements

1. **More Roles**: Add roles like "moderator", "editor"
2. **Permissions**: Granular permissions beyond roles
3. **Team Access**: Allow users to share notes with specific users
4. **Audit Logging**: Track who accessed what and when