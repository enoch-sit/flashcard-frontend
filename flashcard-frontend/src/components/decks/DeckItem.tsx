import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Deck } from '../../types/deck';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';

interface DeckItemProps {
  deck: Deck;
  onDelete: (deckId: string) => void;
}

const DeckItem: React.FC<DeckItemProps> = ({ deck, onDelete }) => {
  const navigate = useNavigate();

  const handleStudyClick = () => {
    navigate(`/study/${deck.id}`);
  };

  const handleViewClick = () => {
    navigate(`/decks/${deck.id}`);
  };

  const handleEditClick = () => {
    navigate(`/decks/${deck.id}/edit`);
  };

  const handleDeleteClick = () => {
    if (window.confirm(`Are you sure you want to delete deck "${deck.name}"? This action cannot be undone.`)) {
      onDelete(deck.id);
    }
  };

  const cardContainerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    border: '1px solid #e0e0e0',
  };

  const cardHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  };

  const titleStyle: React.CSSProperties = {
    margin: '0',
    fontSize: '1.25rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  };

  const cardCountStyle: React.CSSProperties = {
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: '16px',
    padding: '4px 10px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: '0.95rem',
    color: '#555',
    marginBottom: '15px',
    lineHeight: '1.5',
    maxHeight: '3em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  };

  const metaStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: '#777',
    marginBottom: '15px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-start',
  };

  const studyButtonStyle: React.CSSProperties = {
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 15px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'bold',
  };

  const viewButtonStyle: React.CSSProperties = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 15px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  };

  const editButtonStyle: React.CSSProperties = {
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 15px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  };

  const deleteButtonStyle: React.CSSProperties = {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 15px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  };

  return (
    <div style={cardContainerStyle}>
      <div style={cardHeaderStyle}>
        <h3 style={titleStyle}>{deck.name}</h3>
        <span style={cardCountStyle}>{deck.cardCount} card{deck.cardCount !== 1 ? 's' : ''}</span>
      </div>

      <p style={descriptionStyle}>{deck.description || 'No description available.'}</p>

      <div style={metaStyle}>
        <span>Created: {formatDate(deck.createdAt)}</span>
        {deck.lastStudied ? (
          <span>Last studied: {formatRelativeTime(deck.lastStudied)}</span>
        ) : (
          <span>Never studied</span>
        )}
      </div>

      <div style={buttonContainerStyle}>
        <button 
          style={studyButtonStyle} 
          onClick={(e) => {
            e.stopPropagation();
            handleStudyClick();
          }}
          disabled={deck.cardCount === 0}
          title={deck.cardCount === 0 ? "Can't study an empty deck" : "Start studying"}
        >
          Study
        </button>
        
        <button 
          style={viewButtonStyle} 
          onClick={(e) => {
            e.stopPropagation();
            handleViewClick();
          }}
        >
          View
        </button>
        
        <button 
          style={editButtonStyle} 
          onClick={(e) => {
            e.stopPropagation();
            handleEditClick();
          }}
        >
          Edit
        </button>
        
        <button 
          style={deleteButtonStyle} 
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteClick();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeckItem;