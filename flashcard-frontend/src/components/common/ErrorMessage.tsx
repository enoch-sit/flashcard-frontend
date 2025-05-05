import React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onDismiss }) => {
  if (!message) return null;

  const errorStyle: React.CSSProperties = {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontWeight: 500,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  };

  const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#c62828',
    cursor: 'pointer',
    fontSize: '18px',
    fontWeight: 'bold',
    marginLeft: '8px',
    padding: '0',
  };

  return (
    <div style={errorStyle} role="alert">
      <div>{message}</div>
      {onDismiss && (
        <button 
          style={closeButtonStyle} 
          onClick={onDismiss}
          aria-label="Dismiss error message"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;