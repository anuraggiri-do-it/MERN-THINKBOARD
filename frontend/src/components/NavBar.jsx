 
import { Link } from "react-router";
import { Plus } from "lucide-react";

const NavBar = () => {
  return (
    <nav className="navbar bg-base-200 shadow-lg px-8">
      <div className="navbar-start">
        <header className="text-2xl font-bold text-primary">ThinkBoard</header>
      </div>
      <div className="navbar-end">
        <Link to="/create">
          <button className="btn btn-primary gap-2">
            <Plus size={20} />
            New Note
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default NavBar;