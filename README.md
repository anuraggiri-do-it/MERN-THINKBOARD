# MERN ThinkBoard - Role-Based Access Control (RBAC) Implementation

A full-stack note-taking application built with the MERN stack, featuring comprehensive Role-Based Access Control (RBAC) system.

## 🚀 Features

- **User Authentication** - JWT-based login/signup
- **Role-Based Access Control** - User and Admin roles
- **Note Management** - Create, read, update, delete notes
- **Admin Panel** - Manage all users and notes
- **Responsive Design** - Built with Tailwind CSS and DaisyUI

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    MERN ThinkBoard RBAC                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React)           │  Backend (Node.js/Express)    │
│  ┌─────────────────────┐   │  ┌─────────────────────────┐   │
│  │   Auth Context      │   │  │   Auth Middleware       │   │
│  │   - JWT Storage     │◄──┼──┤   - Token Verification  │   │
│  │   - User State      │   │  │   - Role Validation     │   │
│  └─────────────────────┘   │  └─────────────────────────┘   │
│  ┌─────────────────────┐   │  ┌─────────────────────────┐   │
│  │   Route Guards      │   │  │   Protected Routes      │   │
│  │   - ProtectedRoute  │◄──┼──┤   - /notes/my          │   │
│  │   - RoleRoute       │   │  │   - /admin/*           │   │
│  │   - AuthRoute       │   │  │   - /auth/*            │   │
│  └─────────────────────┘   │  └─────────────────────────┘   │
│  ┌─────────────────────┐   │  ┌─────────────────────────┐   │
│  │   Components        │   │  │   Controllers           │   │
│  │   - AdminPage       │◄──┼──┤   - authController      │   │
│  │   - HomePage        │   │  │   - noteController      │   │
│  │   - NavBar          │   │  │   - adminController     │   │
│  └─────────────────────┘   │  └─────────────────────────┘   │
└─────────────────────────────┼─────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   MongoDB Atlas   │
                    │   ┌─────────────┐ │
                    │   │    Users    │ │
                    │   │ - username  │ │
                    │   │ - email     │ │
                    │   │ - password  │ │
                    │   │ - role      │ │
                    │   └─────────────┘ │
                    │   ┌─────────────┐ │
                    │   │    Notes    │ │
                    │   │ - title     │ │
                    │   │ - content   │ │
                    │   │ - author    │ │
                    │   │ - createdAt │ │
                    │   └─────────────┘ │
                    └───────────────────┘
```

## 🔐 RBAC Implementation

### Authentication Flow
```
User Registration/Login
         │
         ▼
   JWT Token Generated
         │
         ▼
   Token Stored (Frontend)
         │
         ▼
   Role-Based Route Access
```

### Role Hierarchy
```
┌─────────────┐
│    Admin    │ ── Can access all routes and manage all users/notes
└─────────────┘
       │
       ▼
┌─────────────┐
│    User     │ ── Can access personal notes and profile
└─────────────┘
```

## 📁 Project Structure

```
MERN-THINKBOARD/
├── backend/
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── noteController.js     # Note CRUD operations
│   │   └── adminController.js    # Admin-specific operations
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── roleAuth.js          # Role-based authorization
│   ├── models/
│   │   ├── User.js              # User schema with roles
│   │   └── Note.js              # Note schema
│   ├── routes/
│   │   ├── auth.js              # Auth routes
│   │   ├── notes.js             # Note routes
│   │   └── admin.js             # Admin routes
│   └── server.js                # Express server setup
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── NavBar.jsx       # Navigation with role-based links
│   │   ├── lib/
│   │   │   ├── auth.jsx         # Auth context with role management
│   │   │   └── axios.js         # API client setup
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # User dashboard
│   │   │   ├── AdminPage.jsx    # Admin panel
│   │   │   ├── LoginPage.jsx    # Login form
│   │   │   ├── SignupPage.jsx   # Signup with role selection
│   │   │   ├── CreatePage.jsx   # Note creation
│   │   │   └── NoteDetailPage.jsx
│   │   └── App.jsx              # Route guards and protection
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account
- Git

### Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start backend:
```bash
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔧 RBAC Implementation Steps

### Backend Changes

#### 1. User Model Enhancement
```javascript
// Added role field to User schema
role: {
  type: String,
  enum: ['user', 'admin'],
  default: 'user'
}
```

#### 2. Role-Based Middleware
```javascript
// middleware/roleAuth.js
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
```

#### 3. Protected Routes
- `/notes/my` - User's personal notes
- `/admin/users` - Admin only: All users
- `/admin/notes` - Admin only: All notes

### Frontend Changes

#### 1. Auth Context Updates
```javascript
// Enhanced to store user role
const [user, setUser] = useState(() => {
  const userData = localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
});
```

#### 2. Route Protection Components
- `ProtectedRoute` - Requires authentication
- `RoleRoute` - Requires specific role
- `AuthRoute` - Redirects authenticated users

#### 3. Role-Based UI
- Admin navigation link (admin only)
- Role selection in signup form
- Conditional rendering based on user role

## 🎯 Key Features by Role

### User Role
- ✅ Create personal notes
- ✅ View own notes
- ✅ Edit/delete own notes
- ✅ User profile management
- ❌ Cannot access admin panel

### Admin Role
- ✅ All user permissions
- ✅ View all users
- ✅ View all notes from all users
- ✅ Delete any note
- ✅ Access admin dashboard
- ✅ User management capabilities

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt encryption
- **Role Validation** - Server-side role checking
- **Route Protection** - Frontend and backend guards
- **CORS Configuration** - Cross-origin security
- **Input Validation** - Data sanitization

## 🚦 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### Notes (User)
- `GET /api/notes/my` - Get user's notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/notes` - Get all notes
- `DELETE /api/admin/notes/:id` - Delete any note

## 🎨 UI Components

- **Responsive Design** - Mobile-first approach
- **DaisyUI Components** - Modern UI elements
- **Loading States** - User feedback
- **Error Handling** - Toast notifications
- **Role Indicators** - Visual role identification

## 🚀 Deployment

### Backend (Railway/Heroku)
```bash
# Set environment variables
MONGODB_URI=your_production_db
JWT_SECRET=your_production_secret
```

### Frontend (Vercel/Netlify)
```bash
# Build for production
npm run build
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/rbac-enhancement`)
3. Commit changes (`git commit -m 'Add RBAC feature'`)
4. Push to branch (`git push origin feature/rbac-enhancement`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🔮 Future Enhancements

- [ ] Multiple role levels (moderator, super-admin)
- [ ] Permission-based access control
- [ ] Audit logging
- [ ] Real-time notifications
- [ ] Advanced user management
- [ ] API rate limiting
- [ ] Two-factor authentication

---

**Built with  using MERN Stack + RBAC**