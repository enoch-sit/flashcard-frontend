import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import * as authApi from '../../api/auth';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Verification token is missing');
        setIsLoading(false);
        return;
      }

      try {
        await authApi.verifyEmail({ token });
        setVerificationSuccess(true);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Email verification failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  const containerStyle: React.CSSProperties = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    textAlign: 'center',
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
    marginTop: '20px',
  };
  
  const successStyle: React.CSSProperties = {
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontWeight: 500,
  };

  if (isLoading) {
    return <Loader size="large" text="Verifying your email..." />;
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '1.5rem' }}>Email Verification</h2>
      
      {error && (
        <>
          <ErrorMessage message={error} />
          <p style={{ marginTop: '15px' }}>
            If you're having trouble with verification, please request a new verification email.
          </p>
          <Link to="/login">
            <button style={buttonStyle}>Back to Login</button>
          </Link>
        </>
      )}
      
      {verificationSuccess && (
        <>
          <div style={successStyle}>
            <h3>Email Verified Successfully!</h3>
            <p>Your email address has been verified. You can now log in to your account.</p>
          </div>
          <button 
            style={buttonStyle}
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;