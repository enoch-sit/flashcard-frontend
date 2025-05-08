import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStudy from '../../hooks/useStudy';
import useDecks from '../../hooks/useDecks';
import FlashcardReview from '../../components/study/FlashcardReview';
import StudySessionSummary from '../../components/study/StudySessionSummary';
import Loader from '../../components/common/Loader';
import ErrorMessage from '../../components/common/ErrorMessage';

const StudySession: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();

  // Get the deck details to show the deck name
  const { fetchDeck, currentDeck, isLoading: isLoadingDeck, error: deckError } = useDecks();

  const { 
    cardsToStudy,
    startStudySession,
    submitCardReview,
    completeStudySession,
    currentSession,
    isLoading: isLoadingStudy,
    error: studyError,
  } = useStudy();

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  useEffect(() => {
    const loadDeck = async () => {
      if (deckId) {
        try {
          await fetchDeck(deckId);
        } catch (error) {
          // Error is handled by the useDecks hook
        }
      }
    };

    loadDeck();

    const initStudySession = async () => {
      if (deckId) {
        try {
          await startStudySession(deckId);
        } catch (error) {
          // Error is handled by the useStudy hook
        }
      }
    };

    initStudySession();
  }, [deckId, fetchDeck, startStudySession]);

  const handleCardAnswer = async (difficulty: number) => {
    if (!deckId || currentCardIndex >= cardsToStudy.length) return;
    
    const card = cardsToStudy[currentCardIndex];
    
    try {
      // Create proper review data object with the correct structure
      await submitCardReview(deckId, { 
        card: { id: card.id }, 
        result: difficulty, 
        timeSpentSeconds: 10 // Placeholder value, ideally would track actual time
      });
      
      // Move to the next card
      if (currentCardIndex < cardsToStudy.length - 1) {
        setCurrentCardIndex(prev => prev + 1);
      } else {
        // End of session with proper completion data
        await completeStudySession(deckId, {
          cardsReviewed: cardsToStudy.length,
          correctResponses: Math.floor(cardsToStudy.length * 0.7), // Placeholder value
          incorrectResponses: Math.ceil(cardsToStudy.length * 0.3), // Placeholder value
          totalTimeSeconds: cardsToStudy.length * 10 // Placeholder value
        });
        setSessionCompleted(true);
      }
    } catch (error) {
      // Error is handled by the useStudy hook
    }
  };

  const handleStartNewSession = async () => {
    if (!deckId) return;
    
    setSessionCompleted(false);
    setCurrentCardIndex(0);
    
    try {
      await startStudySession(deckId);
    } catch (error) {
      // Error is handled by the useStudy hook
    }
  };

  const containerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '30px',
    textAlign: 'center',
  };

  const titleStyle: React.CSSProperties = {
    color: '#2c3e50',
  };

  const progressContainerStyle: React.CSSProperties = {
    marginBottom: '20px',
  };

  const progressBarOuterStyle: React.CSSProperties = {
    height: '10px',
    backgroundColor: '#ecf0f1',
    borderRadius: '5px',
    marginTop: '10px',
    overflow: 'hidden',
  };

  const progressBarInnerStyle = (percentage: number): React.CSSProperties => {
    return {
      height: '100%',
      width: `${percentage}%`,
      backgroundColor: '#3498db',
      borderRadius: '5px',
      transition: 'width 0.3s ease',
    };
  };

  const progressTextStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.9rem',
    color: '#7f8c8d',
  };

  if (isLoadingDeck || isLoadingStudy) {
    return <Loader size="large" text="Loading study session..." />;
  }

  if (deckError || studyError) {
    return <ErrorMessage message={deckError || studyError || 'An error occurred'} />;
  }

  if (!deckId || cardsToStudy.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>No Cards to Study</h1>
        </div>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <p>There are no cards in this deck that need to be reviewed right now.</p>
          <button
            onClick={() => navigate(`/decks/${deckId}`)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '20px',
            }}
          >
            Back to Deck
          </button>
        </div>
      </div>
    );
  }

  // If the session is complete, show the summary
  if (sessionCompleted && currentSession) {
    return (
      <StudySessionSummary 
        session={currentSession} 
        deckName={currentDeck?.name || 'Study Session'}
        onStartNewSession={handleStartNewSession} 
      />
    );
  }

  // Calculate progress percentage
  const progress = ((currentCardIndex + 1) / cardsToStudy.length) * 100;

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Study Session: {currentDeck?.name || 'Unknown Deck'}</h1>
      </div>

      <div style={progressContainerStyle}>
        <div style={progressTextStyle}>
          <span>Card {currentCardIndex + 1} of {cardsToStudy.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div style={progressBarOuterStyle}>
          <div style={progressBarInnerStyle(progress)}></div>
        </div>
      </div>
      
      {cardsToStudy.length > 0 && currentCardIndex < cardsToStudy.length && (
        <FlashcardReview
          card={cardsToStudy[currentCardIndex]}
          onAnswer={handleCardAnswer}
        />
      )}
    </div>
  );
};

export default StudySession;