import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <header className="navbar">
      <Link to="/" className="brand">📋 Team Task Manager</Link>
      <nav className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/projects">Projects</Link>
            <Link to="/tasks">Tasks</Link>
            <span className={`badge ${user.role === 'admin' ? 'admin' : 'member'}`}>
              {user.name} · {user.role}
            </span>
            <button className="btn sm secondary" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup" className="btn sm">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
