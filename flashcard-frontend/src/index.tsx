import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './styles/app.css';
import 'semantic-ui-css/semantic.min.css';
import { AuthProvider } from './contexts/AuthContext';
import { FlashcardProvider } from './contexts/FlashcardContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FlashcardProvider>
          <App />
        </FlashcardProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);