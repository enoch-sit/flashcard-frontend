import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';
import Dashboard from './pages/dashboard/Dashboard';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import DeckList from './pages/decks/DeckList';
import DeckCreate from './pages/decks/DeckCreate';
import DeckDetail from './pages/decks/DeckDetail';
import DeckEdit from './pages/decks/DeckEdit';
import CardList from './pages/cards/CardList';
import CardCreate from './pages/cards/CardCreate';
import CardDetail from './pages/cards/CardDetail';
import CardEdit from './pages/cards/CardEdit';
import StudySession from './pages/study/StudySession';
import StudyHistory from './pages/study/StudyHistory';
import Statistics from './pages/stats/Statistics';
import useAuth from './hooks/useAuth';
import './styles/app.css';

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="app-loader">Loading...</div>;
  }

  return (
    <div className="app-container">
      <Navbar />
      <Container className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          <Route path="/register" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />
          } />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Private Routes using the element prop directly */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route index element={<Dashboard />} />
          </Route>

          {/* Deck Routes */}
          <Route path="/decks" element={<PrivateRoute />}>
            <Route index element={<DeckList />} />
            <Route path="create" element={<DeckCreate />} />
            <Route path=":deckId" element={<DeckDetail />} />
            <Route path=":deckId/edit" element={<DeckEdit />} />
          
            {/* Card Routes (nested under decks) */}
            <Route path=":deckId/cards">
              <Route index element={<CardList />} />
              <Route path="create" element={<CardCreate />} />
              <Route path=":cardId" element={<CardDetail />} />
              <Route path=":cardId/edit" element={<CardEdit />} />
            </Route>
            
            {/* Study Route (nested under decks) */}
            <Route path=":deckId/study" element={<StudySession />} />
          </Route>
          
          {/* Study History Route */}
          <Route path="/study/history" element={<PrivateRoute />}>
            <Route index element={<StudyHistory />} />
          </Route>
          
          {/* Statistics Route */}
          <Route path="/statistics" element={<PrivateRoute />}>
            <Route index element={<Statistics />} />
          </Route>

          {/* Default Route */}
          <Route path="/" element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          } />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
      <footer className="app-footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Flashcard App</p>
        </div>
      </footer>
    </div>
  );
};

export default App;