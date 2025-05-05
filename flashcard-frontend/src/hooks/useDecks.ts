import { useContext } from 'react';
import { FlashcardContext } from '../contexts/FlashcardContext';

const useDecks = () => {
  const context = useContext(FlashcardContext);
  
  if (context === undefined) {
    throw new Error('useDecks must be used within a FlashcardProvider');
  }
  
  const { 
    decks, 
    currentDeck, 
    isLoading, 
    error,
    fetchDecks,
    fetchDeck,
    createDeck,
    updateDeck,
    deleteDeck,
    clearError
  } = context;
  
  return {
    decks,
    currentDeck,
    isLoading,
    error,
    fetchDecks,
    fetchDeck,
    createDeck,
    updateDeck,
    deleteDeck,
    clearError
  };
};

export default useDecks;