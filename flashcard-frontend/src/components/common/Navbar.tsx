import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navbarStyle: React.CSSProperties = {
    backgroundColor: '#2c3e50',
    padding: '1rem',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
    color: 'white',
    textDecoration: 'none',
  };

  const navLinksStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  };

  const linkStyle = (isActive: boolean): React.CSSProperties => ({
    color: 'white',
    textDecoration: 'none',
    fontWeight: isActive ? 'bold' : 'normal',
    borderBottom: isActive ? '2px solid #3498db' : 'none',
    paddingBottom: '4px',
  });

  const buttonStyle: React.CSSProperties = {
    backgroundColor: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const isActive = (path: string): boolean => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <nav style={navbarStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoStyle}>Flashcard App</Link>

        <div style={navLinksStyle}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" style={linkStyle(isActive('/dashboard'))}>
                Dashboard
              </Link>
              <Link to="/decks" style={linkStyle(isActive('/decks'))}>
                My Decks
              </Link>
              <Link to="/study/history" style={linkStyle(isActive('/study/history'))}>
                Study History
              </Link>
              <Link to="/stats" style={linkStyle(isActive('/stats'))}>
                Statistics
              </Link>
              <button onClick={handleLogout} style={buttonStyle}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle(isActive('/login'))}>
                Login
              </Link>
              <Link to="/register" style={linkStyle(isActive('/register'))}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;