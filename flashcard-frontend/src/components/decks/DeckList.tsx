import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import DeckItem from './DeckItem';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import useDecks from '../../hooks/useDecks';

const DeckList: React.FC = () => {
  const { decks, isLoading, error, fetchDecks, deleteDeck, clearError } = useDecks();

  useEffect(() => {
    fetchDecks();
  }, [fetchDecks]);

  const handleDeleteDeck = async (deckId: string) => {
    try {
      await deleteDeck(deckId);
    } catch (error) {
      // Error is handled by the useDecks hook
    }
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const titleStyle: React.CSSProperties = {
    margin: '0',
    color: '#2c3e50',
  };

  const createButtonStyle: React.CSSProperties = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 15px',
    fontSize: '0.95rem',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    margin: '40px 0',
  };

  if (isLoading) {
    return <Loader size="large" text="Loading decks..." />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>My Decks</h1>
        <Link to="/decks/create" style={createButtonStyle}>
          + Create New Deck
        </Link>
      </div>

      {error && <ErrorMessage message={error} onDismiss={clearError} />}

      {decks.length === 0 ? (
        <div style={emptyStateStyle}>
          <h2>No decks found</h2>
          <p>Get started by creating your first flashcard deck!</p>
          <Link to="/decks/create" style={{...createButtonStyle, marginTop: '15px'}}>
            Create Your First Deck
          </Link>
        </div>
      ) : (
        <div>
          {decks.map(deck => (
            <DeckItem 
              key={deck.id} 
              deck={deck} 
              onDelete={handleDeleteDeck} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DeckList;