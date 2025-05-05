import { useContext } from 'react';
import { FlashcardContext } from '../contexts/FlashcardContext';

const useCards = () => {
  const context = useContext(FlashcardContext);
  
  if (context === undefined) {
    throw new Error('useCards must be used within a FlashcardProvider');
  }
  
  const { 
    cards, 
    currentCard, 
    isLoading, 
    error,
    fetchCards,
    fetchCard,
    createCard,
    updateCard,
    deleteCard,
    clearError
  } = context;
  
  return {
    cards,
    currentCard,
    isLoading,
    error,
    fetchCards,
    fetchCard,
    createCard,
    updateCard,
    deleteCard,
    clearError
  };
};

export default useCards;