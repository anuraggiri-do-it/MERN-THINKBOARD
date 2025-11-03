import { Link } from "react-router";
import { Plus, LogOut, Shield } from "lucide-react";
import { useAuth } from "../lib/auth";

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar bg-base-200 shadow-lg px-8">
      <div className="navbar-start">
        <header className="text-2xl font-bold text-primary">ThinkBoard</header>
        <div className="ml-8">
          <span className="text-lg font-medium text-accent">Welcome, {user?.username}!</span>
        </div>
      </div>
      <div className="navbar-end gap-4">
        <Link to="/create">
          <button className="btn btn-primary gap-2">
            <Plus size={20} />
            New Note
          </button>
        </Link>
        {user?.role === 'admin' && (
          <Link to="/admin">
            <button className="btn btn-secondary gap-2">
              <Shield size={20} />
              Admin Panel
            </button>
          </Link>
        )}
        <button onClick={logout} className="btn btn-ghost gap-2">
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default NavBar;