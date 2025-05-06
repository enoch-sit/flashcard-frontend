import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ErrorMessage from '../common/ErrorMessage';

interface LoginFormProps {
  onError?: (message: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onError }) => {
  const { login, isLoading, error, clearError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ username, password });
    } catch (err: any) {
      // Error is handled by the auth context
      if (onError) {
        onError(err.message || 'Login failed');
      }
    }
  };

  const formStyle: React.CSSProperties = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '16px',
  };

  const buttonStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  };

  const disabledButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#95a5a6',
    cursor: 'not-allowed',
  };

  const linkStyle: React.CSSProperties = {
    display: 'block',
    marginTop: '15px',
    textAlign: 'center',
    color: '#3498db',
    textDecoration: 'none',
  };

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Log In</h2>
      
      {error && <ErrorMessage message={error} onDismiss={clearError} />}
      
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          style={inputStyle}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          style={inputStyle}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </div>
      
      <button 
        type="submit" 
        style={isLoading ? disabledButtonStyle : buttonStyle}
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Log In'}
      </button>

      <Link to="/forgot-password" style={linkStyle}>
        Forgot your password?
      </Link>
      
      <Link to="/register" style={linkStyle}>
        Don't have an account? Sign up
      </Link>
    </form>
  );
};

export default LoginForm;