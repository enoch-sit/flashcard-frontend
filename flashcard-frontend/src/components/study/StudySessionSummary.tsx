import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDuration } from '../../utils/dateUtils';

interface Review {
  cardId: string;
  rating: number;
}

interface StudySessionSummaryProps {
  deckId: string;
  deckName: string;
  cardsReviewed: number;
  correctAnswers: number;
  duration: number;
  reviews: Review[];
}

const StudySessionSummary: React.FC<StudySessionSummaryProps> = ({
  deckId,
  deckName,
  cardsReviewed,
  correctAnswers,
  duration,
  reviews,
}) => {
  const navigate = useNavigate();

  // Calculate accuracy percentage
  const accuracy = cardsReviewed > 0 
    ? Math.round((correctAnswers / cardsReviewed) * 100) 
    : 0;

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Count ratings by difficulty level
  const ratingCounts = [0, 0, 0, 0, 0]; // Index 0 won't be used (ratings are 1-4)
  reviews.forEach(review => {
    if (review.rating >= 1 && review.rating <= 4) {
      ratingCounts[review.rating]++;
    }
  });

  // Styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '25px',
    maxWidth: '600px',
    margin: '20px auto',
  };

  const headerStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '25px',
  };

  const titleStyle: React.CSSProperties = {
    color: '#2c3e50',
    margin: '0 0 10px 0',
  };

  const deckNameStyle: React.CSSProperties = {
    color: '#3498db',
    marginTop: '5px',
  };

  const statsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '15px',
    marginBottom: '25px',
  };

  const statCardStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    padding: '15px',
    borderRadius: '6px',
    textAlign: 'center',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 'bold',
    margin: '0',
    color: '#3498db',
  };

  const statLabelStyle: React.CSSProperties = {
    color: '#7f8c8d',
    margin: '5px 0 0 0',
    fontSize: '0.9rem',
  };

  const sectionTitleStyle: React.CSSProperties = {
    color: '#2c3e50',
    marginBottom: '15px',
    fontSize: '1.2rem',
  };

  const ratingBarContainerStyle: React.CSSProperties = {
    marginBottom: '25px',
  };

  const ratingLabelStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '5px',
    fontSize: '0.9rem',
  };

  const ratingBarStyle: React.CSSProperties = {
    display: 'flex',
    height: '25px',
    backgroundColor: '#ecf0f1',
    borderRadius: '4px',
    overflow: 'hidden',
  };

  // Colors for difficulty ratings
  const ratingColors = ['', '#e74c3c', '#f39c12', '#3498db', '#2ecc71'];
  const ratingLabels = ['', 'Hard', 'Difficult', 'Good', 'Easy'];

  const buttonContainerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginTop: '20px',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background-color 0.2s ease',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#3498db',
    color: 'white',
  };

  const secondaryButtonStyle: React.CSSProperties = {
    ...buttonStyle,
    backgroundColor: '#ecf0f1',
    color: '#2c3e50',
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={titleStyle}>Study Session Complete!</h2>
        <h3 style={deckNameStyle}>{deckName}</h3>
      </div>

      <div style={statsContainerStyle}>
        <div style={statCardStyle}>
          <p style={statValueStyle}>{cardsReviewed}</p>
          <p style={statLabelStyle}>Cards Reviewed</p>
        </div>

        <div style={statCardStyle}>
          <p style={statValueStyle}>{accuracy}%</p>
          <p style={statLabelStyle}>Accuracy</p>
        </div>

        <div style={statCardStyle}>
          <p style={statValueStyle}>{averageRating}</p>
          <p style={statLabelStyle}>Average Rating</p>
        </div>

        <div style={statCardStyle}>
          <p style={statValueStyle}>{formatDuration(duration)}</p>
          <p style={statLabelStyle}>Study Time</p>
        </div>
      </div>

      <div style={ratingBarContainerStyle}>
        <h3 style={sectionTitleStyle}>Performance Breakdown</h3>

        {[1, 2, 3, 4].map(rating => {
          const count = ratingCounts[rating];
          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
          
          return (
            <div key={rating} style={{ marginBottom: '10px' }}>
              <div style={ratingLabelStyle}>
                <span>{ratingLabels[rating]}</span>
                <span>{count} ({Math.round(percentage)}%)</span>
              </div>
              <div style={ratingBarStyle}>
                <div 
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: ratingColors[rating],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div style={buttonContainerStyle}>
        <button 
          style={primaryButtonStyle} 
          onClick={() => navigate(`/decks/${deckId}/study`)}
        >
          Study Again
        </button>
        <button 
          style={secondaryButtonStyle} 
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default StudySessionSummary;