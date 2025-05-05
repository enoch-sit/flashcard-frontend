import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import * as authApi from '../../api/auth';
import ErrorMessage from '../common/ErrorMessage';
import { validatePassword, doPasswordsMatch } from '../../utils/validation';

const PasswordReset: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [resetSuccess, setResetSuccess] = useState(false);

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid && passwordValidation.message) {
      errors.push(passwordValidation.message);
    }
    
    if (!doPasswordsMatch(newPassword, confirmPassword)) {
      errors.push('Passwords do not match');
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token) {
      setError('Password reset token is missing');
      return;
    }
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await authApi.resetPassword({ token, newPassword });
      setResetSuccess(true);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
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

  if (!token) {
    return (
      <div style={formStyle}>
        <ErrorMessage message="Invalid password reset link. Please request a new password reset." />
        <Link to="/forgot-password" style={linkStyle}>Back to Forgot Password</Link>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div style={formStyle}>
        <div style={successStyle}>
          <h2>Password Reset Successful!</h2>
          <p>Your password has been changed. You can now log in with your new password.</p>
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
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Reset Password</h2>
      
      {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}
      
      {validationErrors.length > 0 && (
        <div style={{ marginBottom: '15px' }}>
          {validationErrors.map((error, index) => (
            <ErrorMessage key={index} message={error} />
          ))}
        </div>
      )}
      
      <div>
        <label htmlFor="newPassword">New Password</label>
        <input
          id="newPassword"
          type="password"
          style={inputStyle}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          required
        />
      </div>
      
      <div>
        <label htmlFor="confirmPassword">Confirm New Password</label>
        <input
          id="confirmPassword"
          type="password"
          style={inputStyle}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm your new password"
          required
        />
      </div>
      
      <button 
        type="submit" 
        style={isLoading ? disabledButtonStyle : buttonStyle}
        disabled={isLoading}
      >
        {isLoading ? 'Resetting...' : 'Reset Password'}
      </button>
      
      <Link to="/login" style={linkStyle}>
        Back to Login
      </Link>
    </form>
  );
};

export default PasswordReset;