import React, { useState } from 'react';
import { Card } from '../../types/card';

interface FlashcardReviewProps {
  card: Card;
  onAnswer: (difficulty: number) => void;
}

const FlashcardReview: React.FC<FlashcardReviewProps> = ({ card, onAnswer }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showAnswerControls, setShowAnswerControls] = useState(false);

  const handleFlip = () => {
    if (!isFlipped) {
      setIsFlipped(true);
      setShowAnswerControls(true);
    }
  };

  const handleDifficultyRating = (rating: number) => {
    onAnswer(rating);
    // Reset state for next card
    setIsFlipped(false);
    setShowAnswerControls(false);
  };

  // Styles
  const cardContainerStyle: React.CSSProperties = {
    perspective: '1000px',
    marginBottom: '20px',
  };

  const cardInnerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '300px', // Fixed height for consistent sizing
    textAlign: 'center',
    transition: 'transform 0.6s',
    transformStyle: 'preserve-3d',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
    cursor: isFlipped ? 'default' : 'pointer',
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
    borderRadius: '8px',
    backgroundColor: '#ffffff',
    overflow: 'auto',
  };

  const cardBackStyle: React.CSSProperties = {
    ...cardFaceStyle,
    transform: 'rotateY(180deg)',
    backgroundColor: '#f8f9fa',
  };

  const cardContentStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    color: '#2c3e50',
    maxWidth: '100%',
    whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
    wordBreak: 'break-word',
  };

  const btnContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '20px',
  };

  const tipStyle: React.CSSProperties = {
    color: '#7f8c8d',
    fontSize: '0.9rem',
    marginTop: '10px',
    fontStyle: 'italic',
  };

  const tagContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '15px',
    justifyContent: 'center',
  };

  const tagStyle: React.CSSProperties = {
    backgroundColor: '#e0f2fe',
    color: '#3b82f6',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.8rem',
  };

  const difficultyButtonStyles = [
    { backgroundColor: '#e74c3c', color: 'white' }, // Hard - 1
    { backgroundColor: '#f39c12', color: 'white' }, // Difficult - 2
    { backgroundColor: '#3498db', color: 'white' }, // Good - 3
    { backgroundColor: '#2ecc71', color: 'white' }, // Easy - 4
  ];

  const renderDifficultyButton = (rating: number, label: string, style: React.CSSProperties) => (
    <button
      onClick={() => handleDifficultyRating(rating)}
      style={{
        padding: '10px 20px',
        border: 'none',
        borderRadius: '4px',
        fontSize: '1rem',
        cursor: 'pointer',
        fontWeight: 'bold',
        ...style,
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={cardContainerStyle}>
      <div style={cardInnerStyle} onClick={!isFlipped ? handleFlip : undefined}>
        {/* Front side - Question */}
        <div style={cardFaceStyle}>
          <div style={cardContentStyle}>
            {card.front}
          </div>
          {card.tags && card.tags.length > 0 && (
            <div style={tagContainerStyle}>
              {card.tags.map((tag, index) => (
                <span key={index} style={tagStyle}>{tag}</span>
              ))}
            </div>
          )}
          <p style={tipStyle}>Click to see answer</p>
        </div>

        {/* Back side - Answer */}
        <div style={cardBackStyle}>
          <div style={cardContentStyle}>
            {card.back}
          </div>
        </div>
      </div>

      {/* Rating buttons (only shown after flipping) */}
      {showAnswerControls && (
        <div style={btnContainerStyle}>
          {renderDifficultyButton(1, 'Hard', difficultyButtonStyles[0])}
          {renderDifficultyButton(2, 'Difficult', difficultyButtonStyles[1])}
          {renderDifficultyButton(3, 'Good', difficultyButtonStyles[2])}
          {renderDifficultyButton(4, 'Easy', difficultyButtonStyles[3])}
        </div>
      )}
    </div>
  );
};

export default FlashcardReview;