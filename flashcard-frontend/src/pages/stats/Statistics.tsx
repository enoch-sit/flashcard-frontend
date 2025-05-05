import React, { useEffect, useState } from 'react';
import useStudy from '../../hooks/useStudy';
import useDecks from '../../hooks/useDecks';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate, formatRelativeTime, formatDuration } from '../../utils/dateUtils';

const Statistics: React.FC = () => {
  const { 
    recentSessions, 
    fetchAllStudySessions,
    studyStats, 
    fetchStudyStatistics,
    isLoading, 
    error 
  } = useStudy();
  
  const { 
    decks, 
    fetchDecks, 
    isLoading: isLoadingDecks, 
    error: decksError 
  } = useDecks();

  useEffect(() => {
    fetchAllStudySessions();
    fetchStudyStatistics();
    fetchDecks();
  }, [fetchAllStudySessions, fetchStudyStatistics, fetchDecks]);

  const containerStyle: React.CSSProperties = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '30px',
  };

  const titleStyle: React.CSSProperties = {
    color: '#2c3e50',
    marginBottom: '10px',
  };

  const subtitleStyle: React.CSSProperties = {
    color: '#7f8c8d',
    fontWeight: 'normal',
    marginTop: '0',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px',
  };

  const statsGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  };

  const statCardStyle: React.CSSProperties = {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    textAlign: 'center',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    margin: '0',
    color: '#3498db',
  };

  const statLabelStyle: React.CSSProperties = {
    color: '#7f8c8d',
    margin: '5px 0 0 0',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '20px',
  };

  const sectionTitleStyle: React.CSSProperties = {
    margin: 0,
    color: '#2c3e50',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle: React.CSSProperties = {
    textAlign: 'left',
    padding: '12px 15px',
    backgroundColor: '#f8f9fa',
    borderBottom: '1px solid #e0e0e0',
  };

  const tdStyle: React.CSSProperties = {
    padding: '12px 15px',
    borderBottom: '1px solid #f1f1f1',
  };

  const barChartContainerStyle: React.CSSProperties = {
    marginTop: '30px',
    height: '200px',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    padding: '0 10px',
  };

  const calculateBarHeight = (value: number, maxValue: number): number => {
    if (maxValue === 0) return 0;
    return (value / maxValue) * 180; // Max height of 180px
  };

  // Get the max values for our charts
  const maxSessionCards = Math.max(...recentSessions.map(s => s.reviews.length), 1);
  const maxDeckCardCount = Math.max(...decks.map(d => d.cardCount || 0), 1);

  // Calculate average difficulty across all sessions
  const calculateAverageDifficulty = (): number => {
    const allReviews = recentSessions.flatMap(s => s.reviews);
    if (allReviews.length === 0) return 0;
    
    const sum = allReviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / allReviews.length).toFixed(1));
  };

  // Calculate total study time
  const calculateTotalStudyTime = (): number => {
    return recentSessions.reduce((total, session) => total + session.duration, 0);
  };

  if (isLoading || isLoadingDecks) {
    return <Loader size="large" text="Loading statistics..." />;
  }

  if (error || decksError) {
    return <ErrorMessage message={error || decksError || 'An error occurred'} />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Statistics</h1>
        <h2 style={subtitleStyle}>Track your learning progress</h2>
      </div>
      
      {/* Summary Statistics */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Summary</h2>
        </div>
        
        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <p style={statValueStyle}>{studyStats.totalCards || 0}</p>
            <p style={statLabelStyle}>Total Cards</p>
          </div>
          
          <div style={statCardStyle}>
            <p style={statValueStyle}>{studyStats.totalReviews || 0}</p>
            <p style={statLabelStyle}>Total Reviews</p>
          </div>
          
          <div style={statCardStyle}>
            <p style={statValueStyle}>{studyStats.totalSessions || 0}</p>
            <p style={statLabelStyle}>Study Sessions</p>
          </div>
          
          <div style={statCardStyle}>
            <p style={statValueStyle}>{formatDuration(calculateTotalStudyTime())}</p>
            <p style={statLabelStyle}>Total Study Time</p>
          </div>
          
          <div style={statCardStyle}>
            <p style={statValueStyle}>{calculateAverageDifficulty()}</p>
            <p style={statLabelStyle}>Avg. Difficulty</p>
          </div>
        </div>
      </div>
      
      {/* Deck Statistics */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Decks</h2>
        </div>
        
        {decks.length > 0 ? (
          <>
            <div style={barChartContainerStyle}>
              {decks.slice(0, 10).map(deck => (
                <div key={deck.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1' }}>
                  <div 
                    style={{ 
                      height: `${calculateBarHeight(deck.cardCount || 0, maxDeckCardCount)}px`,
                      width: '40px',
                      backgroundColor: '#3498db',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                  <div style={{ 
                    fontSize: '0.8rem', 
                    marginTop: '5px', 
                    textAlign: 'center', 
                    width: '60px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }} title={deck.name}>
                    {deck.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#7f8c8d' }}>
                    {deck.cardCount} cards
                  </div>
                </div>
              ))}
            </div>
            
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Deck Name</th>
                  <th style={thStyle}>Cards</th>
                  <th style={thStyle}>Due Cards</th>
                  <th style={thStyle}>Last Studied</th>
                </tr>
              </thead>
              <tbody>
                {decks.map(deck => (
                  <tr key={deck.id}>
                    <td style={tdStyle}>{deck.name}</td>
                    <td style={tdStyle}>{deck.cardCount}</td>
                    <td style={tdStyle}>{deck.dueCardCount || 0}</td>
                    <td style={tdStyle}>
                      {deck.lastStudied 
                        ? formatRelativeTime(deck.lastStudied)
                        : 'Never'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
            No decks created yet.
          </p>
        )}
      </div>
      
      {/* Recent Sessions */}
      <div style={cardStyle}>
        <div style={sectionHeaderStyle}>
          <h2 style={sectionTitleStyle}>Recent Study Sessions</h2>
        </div>
        
        {recentSessions.length > 0 ? (
          <>
            <div style={barChartContainerStyle}>
              {recentSessions.slice(0, 10).map(session => (
                <div key={session.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1' }}>
                  <div 
                    style={{ 
                      height: `${calculateBarHeight(session.reviews.length, maxSessionCards)}px`,
                      width: '40px',
                      backgroundColor: '#2ecc71',
                      borderRadius: '4px 4px 0 0',
                    }}
                  />
                  <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>
                    {formatDate(session.completedAt, 'MM/DD')}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#7f8c8d' }}>
                    {session.reviews.length} cards
                  </div>
                </div>
              ))}
            </div>
            
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Deck</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Cards</th>
                  <th style={thStyle}>Duration</th>
                  <th style={thStyle}>Avg. Rating</th>
                </tr>
              </thead>
              <tbody>
                {recentSessions.map(session => {
                  // Calculate average rating
                  const avgRating = session.reviews.length > 0
                    ? (session.reviews.reduce((sum, r) => sum + r.rating, 0) / session.reviews.length).toFixed(1)
                    : '-';
                  
                  return (
                    <tr key={session.id}>
                      <td style={tdStyle}>{session.deckName}</td>
                      <td style={tdStyle}>{formatDate(session.completedAt)}</td>
                      <td style={tdStyle}>{session.reviews.length}</td>
                      <td style={tdStyle}>{formatDuration(session.duration)}</td>
                      <td style={tdStyle}>{avgRating}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          <p style={{ textAlign: 'center', color: '#7f8c8d' }}>
            No study sessions yet. Start studying to see statistics!
          </p>
        )}
      </div>
    </div>
  );
};

export default Statistics;