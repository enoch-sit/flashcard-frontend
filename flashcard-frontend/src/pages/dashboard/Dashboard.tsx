import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useDecks from '../../hooks/useDecks';
import useStudy from '../../hooks/useStudy';
import RecentActivity from '../../components/study/RecentActivity';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatRelativeTime } from '../../utils/dateUtils';
import { Deck } from '../../types/deck';

const Dashboard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const showReview = searchParams.get('review') === 'true';

  const { decks, fetchDecks, isLoading: isLoadingDecks, error: decksError } = useDecks();
  const { 
    recentSessions, 
    upcomingReviewCount,
    fetchRecentSessions,
    isLoading: isLoadingStudy, 
    error: studyError 
  } = useStudy();

  const [reviewMode, setReviewMode] = useState(showReview);

  useEffect(() => {
    fetchDecks();
    fetchRecentSessions();
  }, [fetchDecks, fetchRecentSessions]);

  // Sort decks by last studied date (most recent first)
  const sortedDecks = [...decks].sort((a, b) => {
    // If neither has been studied, sort by creation date
    if (!a.lastStudied && !b.lastStudied) {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    // If one has not been studied, the studied one comes first
    if (!a.lastStudied) return 1;
    if (!b.lastStudied) return -1;
    // Otherwise sort by last studied date
    return new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime();
  });
  
  // Get decks with cards due for review
  const decksWithDueCards = sortedDecks.filter(deck => 
    deck.dueCardCount && deck.dueCardCount > 0
  );

  const containerStyle: React.CSSProperties = {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  };

  const titleStyle: React.CSSProperties = {
    margin: '0',
    color: '#2c3e50',
  };

  const buttonStyle: React.CSSProperties = {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    padding: '10px 18px',
    fontSize: '1rem',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
  };

  const twoColumnLayoutStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px',
  };

  const sectionHeaderStyle: React.CSSProperties = {
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    marginBottom: '15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const sectionTitleStyle: React.CSSProperties = {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.4rem',
  };

  const viewAllStyle: React.CSSProperties = {
    color: '#3498db',
    textDecoration: 'none',
    fontSize: '0.9rem',
  };

  const deckListStyle: React.CSSProperties = {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  };

  const deckItemStyle: React.CSSProperties = {
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
    position: 'relative',
  };

  const deckTitleStyle: React.CSSProperties = {
    margin: '0 0 5px 0',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  };

  const deckMetaStyle: React.CSSProperties = {
    fontSize: '0.85rem',
    color: '#7f8c8d',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  };

  const badgeStyle: React.CSSProperties = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '12px',
    padding: '2px 10px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  };

  const emptyStateStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '30px',
    color: '#7f8c8d',
  };

  const renderDeckItem = (deck: Deck) => {
    return (
      <Link 
        to={`/decks/${deck.id}`} 
        style={{ textDecoration: 'none' }}
        key={deck.id}
      >
        <li style={deckItemStyle}>
          {deck.dueCardCount && deck.dueCardCount > 0 && (
            <div style={badgeStyle}>{deck.dueCardCount} due</div>
          )}
          <h3 style={deckTitleStyle}>{deck.name}</h3>
          <div style={deckMetaStyle}>
            <span>{deck.cardCount} card{deck.cardCount !== 1 ? 's' : ''}</span>
            {deck.lastStudied ? (
              <span>Last studied {formatRelativeTime(deck.lastStudied)}</span>
            ) : (
              <span>Never studied</span>
            )}
          </div>
          {deck.dueCardCount && deck.dueCardCount > 0 && (
            <Link 
              to={`/study/${deck.id}`}
              style={{...buttonStyle, fontSize: '0.9rem', padding: '8px 15px'}}
            >
              Study Now
            </Link>
          )}
        </li>
      </Link>
    );
  };

  if (isLoadingDecks || isLoadingStudy) {
    return <Loader size="large" text="Loading dashboard..." />;
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Dashboard</h1>
        <Link to="/decks/create" style={buttonStyle}>
          + Create New Deck
        </Link>
      </div>

      {decksError && <ErrorMessage message={decksError} />}
      {studyError && <ErrorMessage message={studyError} />}

      {/* Review mode section */}
      {reviewMode && upcomingReviewCount > 0 && (
        <div style={{...cardStyle, marginBottom: '30px', backgroundColor: '#ebf7ff'}}>
          <h2 style={{marginTop: 0}}>Cards Due for Review</h2>
          <p>You have {upcomingReviewCount} card{upcomingReviewCount !== 1 ? 's' : ''} that need review.</p>
          
          <div style={deckListStyle}>
            {decksWithDueCards.map(deck => renderDeckItem(deck))}
          </div>
          
          <div style={{textAlign: 'right', marginTop: '20px'}}>
            <button 
              style={{...buttonStyle, backgroundColor: '#7f8c8d'}}
              onClick={() => setReviewMode(false)}
            >
              Hide Review Mode
            </button>
          </div>
        </div>
      )}

      {/* Main dashboard content */}
      <div style={twoColumnLayoutStyle}>
        <div>
          <RecentActivity 
            recentSessions={recentSessions.slice(0, 5)} 
            upcomingCards={upcomingReviewCount}
          />

          <div style={cardStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>Statistics</h2>
              <Link to="/stats" style={viewAllStyle}>
                View Detailed Stats
              </Link>
            </div>

            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p>You've studied <strong>{recentSessions.reduce((sum: number, session: any) => sum + session.reviews.length, 0)}</strong> cards in total.</p>
              <p>Keep up the good work!</p>
            </div>
          </div>
        </div>

        <div>
          <div style={cardStyle}>
            <div style={sectionHeaderStyle}>
              <h2 style={sectionTitleStyle}>Your Decks</h2>
              <Link to="/decks" style={viewAllStyle}>
                View All
              </Link>
            </div>

            {decks.length === 0 ? (
              <div style={emptyStateStyle}>
                <p>You haven't created any flashcard decks yet.</p>
                <Link to="/decks/create" style={{...buttonStyle, marginTop: '15px'}}>
                  Create Your First Deck
                </Link>
              </div>
            ) : (
              <ul style={deckListStyle}>
                {sortedDecks.slice(0, 5).map(deck => renderDeckItem(deck))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;