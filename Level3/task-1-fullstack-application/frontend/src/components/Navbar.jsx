import { Link, useNavigate } from 'react-router-dom';
import { LogOut, LayoutDashboard, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/dashboard" className="brand">
        TaskFlow
      </Link>

      <div className="nav-links">
        <Link to="/dashboard">
          <LayoutDashboard size={17} />
          Dashboard
        </Link>

        {user?.role === 'admin' && (
          <Link to="/admin">
            <ShieldCheck size={17} />
            Admin
          </Link>
        )}

        <span className="nav-user">{user?.name}</span>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;