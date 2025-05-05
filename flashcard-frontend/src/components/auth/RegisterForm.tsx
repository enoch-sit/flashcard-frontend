import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ErrorMessage from '../common/ErrorMessage';
import { isValidEmail, validatePassword, doPasswordsMatch, isValidUsername } from '../../utils/validation';

const RegisterForm: React.FC = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!isValidUsername(username)) {
      errors.push('Username must be 3-20 characters and contain only letters, numbers, and underscores');
    }
    
    if (!isValidEmail(email)) {
      errors.push('Please enter a valid email address');
    }
    
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid && passwordValidation.message) {
      errors.push(passwordValidation.message);
    }
    
    if (!doPasswordsMatch(password, confirmPassword)) {
      errors.push('Passwords do not match');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      await register({ username, email, password });
      setRegistrationSuccess(true);
      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      // Error is handled by auth context
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
  
  const successStyle: React.CSSProperties = {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontWeight: 500,
    textAlign: 'center',
  };

  if (registrationSuccess) {
    return (
      <div style={formStyle}>
        <div style={successStyle}>
          <h2>Registration Successful!</h2>
          <p>Please check your email to verify your account.</p>
          <button 
            style={buttonStyle}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <form style={formStyle} onSubmit={handleSubmit}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Sign Up</h2>
      
      {error && <ErrorMessage message={error} onDismiss={clearError} />}
      
      {validationErrors.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          {validationErrors.map((error, index) => (
            <ErrorMessage key={index} message={error} />
          ))}
        </div>
      )}
      
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          style={inputStyle}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a username"
          required
        />
      </div>
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          style={inputStyle}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
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
          placeholder="Create a password"
          required
        />
      </div>
      
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          style={inputStyle}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your password"
          required
        />
      </div>
      
      <button 
        type="submit" 
        style={isLoading ? disabledButtonStyle : buttonStyle}
        disabled={isLoading}
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>
      
      <Link to="/login" style={linkStyle}>
        Already have an account? Log in
      </Link>
    </form>
  );
};

export default RegisterForm;