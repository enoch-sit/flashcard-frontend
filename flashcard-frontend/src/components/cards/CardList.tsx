import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import CardItem from './CardItem';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';
import useCards from '../../hooks/useCards';

interface CardListProps {
  deckId: string;
  deckName: string;
}

const CardList: React.FC<CardListProps> = ({ deckId, deckName }) => {
  const { cards, isLoading, error, fetchCards, deleteCard, clearError } = useCards();

  useEffect(() => {
    fetchCards(deckId);
  }, [deckId, fetchCards]);

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(deckId, cardId);
    } catch (error) {
      // Error is handled by the useCards hook
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

  const cardGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px',
    marginTop: '30px',
  };

  if (isLoading) {
    return <Loader size="large" text="Loading flashcards..." />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>{deckName}</h1>
          <p>
            {cards.length} card{cards.length !== 1 ? 's' : ''} in this deck
          </p>
        </div>
        <Link to={`/decks/${deckId}/cards/create`} style={createButtonStyle}>
          + Add Card
        </Link>
      </div>

      {error && <ErrorMessage message={error} onDismiss={clearError} />}

      {cards.length === 0 ? (
        <div style={emptyStateStyle}>
          <h2>No flashcards in this deck</h2>
          <p>Get started by adding your first flashcard!</p>
          <Link to={`/decks/${deckId}/cards/create`} style={{...createButtonStyle, marginTop: '15px'}}>
            Create Your First Card
          </Link>
        </div>
      ) : (
        <div style={cardGridStyle}>
          {cards.map(card => (
            <CardItem 
              key={card.id} 
              card={card} 
              deckId={deckId}
              onDelete={handleDeleteCard} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CardList;