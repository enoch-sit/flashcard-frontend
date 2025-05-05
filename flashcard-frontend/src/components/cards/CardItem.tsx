import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../types/card';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';

interface CardItemProps {
  card: Card;
  deckId: string;
  onDelete: (cardId: string) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, deckId, onDelete }) => {
  const navigate = useNavigate();
  const [isFlipped, setIsFlipped] = useState(false);

  const handleEditClick = () => {
    navigate(`/decks/${deckId}/cards/${card.id}/edit`);
  };

  const handleDeleteClick = () => {
    if (window.confirm('Are you sure you want to delete this card? This action cannot be undone.')) {
      onDelete(card.id);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const cardContainerStyle: React.CSSProperties = {
    perspective: '1000px',
    width: '100%',
    marginBottom: '20px',
  };

  const cardStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '200px',
    cursor: 'pointer',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
  };

  const cardFaceStyle: React.CSSProperties = {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    boxSizing: 'border-box',
    borderRadius: '8px',
  };

  const frontStyle: React.CSSProperties = {
    ...cardFaceStyle,
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    color: '#2c3e50',
  };

  const backStyle: React.CSSProperties = {
    ...cardFaceStyle,
    backgroundColor: '#f8f9fa',
    border: '1px solid #e0e0e0',
    transform: 'rotateY(180deg)',
    color: '#2c3e50',
  };

  const contentStyle: React.CSSProperties = {
    fontSize: '1.1rem',
    textAlign: 'center',
    wordBreak: 'break-word',
    overflow: 'auto',
    maxHeight: '120px',
    width: '100%',
  };

  const metaStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '10px',
    left: '0',
    right: '0',
    fontSize: '0.8rem',
    color: '#7f8c8d',
    textAlign: 'center',
    padding: '0 10px',
  };

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '8px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 'normal',
  };

  const editButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#f39c12',
    color: 'white',
  };

  const deleteButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#e74c3c',
    color: 'white',
  };

  const reviewDateStyle: React.CSSProperties = {
    marginTop: '5px',
    fontSize: '0.85rem',
    color: '#3498db',
  };

  return (
    <div>
      <div style={cardContainerStyle}>
        <div style={cardStyle} onClick={flipCard}>
          <div style={frontStyle}>
            <div style={contentStyle}>{card.front}</div>
            <div style={metaStyle}>
              Click to flip
            </div>
          </div>
          <div style={backStyle}>
            <div style={contentStyle}>{card.back}</div>
            {card.notes && (
              <div style={{ 
                fontSize: '0.9rem', 
                marginTop: '15px', 
                color: '#666',
                fontStyle: 'italic',
                textAlign: 'center',
                maxHeight: '40px',
                overflow: 'auto',
                width: '100%',
              }}>
                Note: {card.notes}
              </div>
            )}
            <div style={metaStyle}>
              Click to flip
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center' 
      }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: '#7f8c8d' }}>
            Reviewed {card.reviewCount} times
          </span>
          <div style={reviewDateStyle}>
            Next review: {formatRelativeTime(card.nextReviewDate)}
          </div>
        </div>
        <div style={buttonContainerStyle}>
          <button 
            style={editButtonStyle} 
            onClick={handleEditClick}
          >
            Edit
          </button>
          <button 
            style={deleteButtonStyle} 
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardItem;