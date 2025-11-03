import { Route, Routes, Navigate, Link } from "react-router";
import { AuthProvider, useAuth } from "./lib/auth.jsx";
import HomePage from "./pages/HomePage";
import CreatePage from "./pages/CreatePage";
import NoteDetailPage from "./pages/NoteDetailPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AdminPage from "./pages/AdminPage";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/signup" />;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <span className="loading loading-ring loading-lg text-primary"></span>
      </div>
    );
  }
  
  return user ? <Navigate to="/" /> : children;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  return allowedRoles.includes(user?.role) ? children : <Navigate to="/unauthorized" />;
};

const UnauthorizedPage = () => (
  <div className="min-h-screen bg-base-200 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-error mb-4">403 - Unauthorized</h1>
      <p className="text-lg mb-4">You don't have permission to access this page.</p>
      <Link to="/" className="btn btn-primary">Go Home</Link>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <div className="relative min-h-screen w-full" style={{background: 'radial-gradient(125% 125% at 50% 10%, #000 60%, rgba(0, 255, 157, 0.25) 100%)'}}>
      <Routes>
        <Route path="/signup" element={<AuthRoute><SignupPage /></AuthRoute>} />
        <Route path="/login" element={<AuthRoute><LoginPage /></AuthRoute>} />
        <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/create" element={<ProtectedRoute><CreatePage /></ProtectedRoute>} />
        <Route path="/note/:id" element={<ProtectedRoute><NoteDetailPage /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><RoleRoute allowedRoles={['admin']}><AdminPage /></RoleRoute></ProtectedRoute>} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
};

export default App;