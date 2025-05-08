import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from '../../utils/dateUtils';

interface StudySession {
  id: string;
  deckId: string;
  deckName: string;
  cardsReviewed: number;
  accuracy: number;
  date: string;
}

interface RecentActivityProps {
  recentSessions: StudySession[];
  isLoading?: boolean;
  upcomingCards?: number; // Adding the missing upcomingCards property
}

const RecentActivity: React.FC<RecentActivityProps> = ({ recentSessions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="activity-loading">
        <p>Loading recent activity...</p>
      </div>
    );
  }

  if (recentSessions.length === 0) {
    return (
      <div className="activity-empty">
        <h3>No Recent Activity</h3>
        <p>You haven't studied any flashcards yet. Choose a deck and start studying!</p>
      </div>
    );
  }

  // Styles
  const containerStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    padding: '20px',
  };

  const headerStyle: React.CSSProperties = {
    color: '#2c3e50',
    fontSize: '1.4rem',
    marginTop: '0',
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eaeaea',
  };

  const sessionItemStyle: React.CSSProperties = {
    padding: '12px 0',
    borderBottom: '1px solid #f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const sessionInfoStyle: React.CSSProperties = {
    flex: 1,
  };

  const deckNameStyle: React.CSSProperties = {
    color: '#3498db',
    margin: '0 0 5px 0',
    fontSize: '1.1rem',
    fontWeight: 'bold',
  };

  const metaInfoStyle: React.CSSProperties = {
    color: '#7f8c8d',
    margin: '0',
    fontSize: '0.9rem',
  };

  const accuracyStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    marginLeft: '15px',
  };

  const accuracyBadgeStyle: (accuracy: number) => React.CSSProperties = (accuracy) => {
    let color = '#2ecc71'; // Good (green)
    if (accuracy < 60) {
      color = '#e74c3c'; // Poor (red)
    } else if (accuracy < 80) {
      color = '#f39c12'; // Fair (orange)
    }
    
    return {
      backgroundColor: color,
      color: 'white',
      borderRadius: '50%',
      width: '45px',
      height: '45px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    };
  };

  const accuracyLabelStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    color: '#95a5a6',
    marginTop: '5px',
  };

  const viewButtonStyle: React.CSSProperties = {
    backgroundColor: '#f8f9fa',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 12px',
    color: '#3498db',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '0.9rem',
    marginLeft: '10px',
    textDecoration: 'none',
  };

  return (
    <div style={containerStyle}>
      <h3 style={headerStyle}>Recent Study Sessions</h3>
      
      {recentSessions.map(session => (
        <div key={session.id} style={sessionItemStyle}>
          <div style={sessionInfoStyle}>
            <p style={deckNameStyle}>{session.deckName}</p>
            <p style={metaInfoStyle}>
              {formatDistanceToNow(new Date(session.date))} • {session.cardsReviewed} cards
            </p>
          </div>
          
          <div style={accuracyStyle}>
            <div style={accuracyBadgeStyle(session.accuracy)}>
              {Math.round(session.accuracy)}%
            </div>
            <span style={accuracyLabelStyle}>Accuracy</span>
          </div>
          
          <Link to={`/stats/sessions/${session.id}`} style={viewButtonStyle}>
            Details
          </Link>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;