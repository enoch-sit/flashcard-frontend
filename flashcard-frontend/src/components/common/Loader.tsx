import React from 'react';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const getLoaderSize = () => {
    switch (size) {
      case 'small':
        return '20px';
      case 'large':
        return '60px';
      case 'medium':
      default:
        return '40px';
    }
  };

  const loaderStyle: React.CSSProperties = {
    width: getLoaderSize(),
    height: getLoaderSize(),
    border: `4px solid rgba(0, 0, 0, 0.1)`,
    borderLeftColor: '#3498db',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  };

  const containerStyle: React.CSSProperties = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 1000,
  } : {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  };

  const textStyle: React.CSSProperties = {
    marginTop: '10px',
    color: '#333',
    fontSize: size === 'large' ? '18px' : size === 'small' ? '12px' : '16px',
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div style={loaderStyle}></div>
      {text && <div style={textStyle}>{text}</div>}
    </div>
  );
};

export default Loader;