import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Deck, DeckCreateRequest, DeckUpdateRequest } from '../types/deck';
import { Card, CardCreateRequest, CardUpdateRequest } from '../types/card';
import * as decksApi from '../api/decks';
import * as cardsApi from '../api/cards';

interface FlashcardContextType {
  decks: Deck[];
  currentDeck: Deck | null;
  cards: Card[];
  currentCard: Card | null;
  isLoading: boolean;
  error: string | null;
  
  // Deck operations
  fetchDecks: () => Promise<void>;
  fetchDeck: (deckId: string) => Promise<void>;
  createDeck: (data: DeckCreateRequest) => Promise<Deck>;
  updateDeck: (deckId: string, data: DeckUpdateRequest) => Promise<Deck>;
  deleteDeck: (deckId: string) => Promise<void>;
  
  // Card operations
  fetchCards: (deckId: string) => Promise<void>;
  fetchCard: (deckId: string, cardId: string) => Promise<void>;
  createCard: (deckId: string, data: CardCreateRequest) => Promise<Card>;
  updateCard: (deckId: string, cardId: string, data: CardUpdateRequest) => Promise<Card>;
  deleteCard: (deckId: string, cardId: string) => Promise<void>;
  
  // Misc
  clearError: () => void;
}

export const FlashcardContext = createContext<FlashcardContextType>({
  decks: [],
  currentDeck: null,
  cards: [],
  currentCard: null,
  isLoading: false,
  error: null,
  
  fetchDecks: async () => {},
  fetchDeck: async () => {},
  createDeck: async () => ({ id: '', name: '', description: '', cardCount: 0, createdAt: '', updatedAt: '' }),
  updateDeck: async () => ({ id: '', name: '', description: '', cardCount: 0, createdAt: '', updatedAt: '' }),
  deleteDeck: async () => {},
  
  fetchCards: async () => {},
  fetchCard: async () => {},
  createCard: async () => ({ id: '', front: '', back: '', difficulty: 0, nextReviewDate: '', reviewCount: 0, createdAt: '', updatedAt: '' }),
  updateCard: async () => ({ id: '', front: '', back: '', difficulty: 0, nextReviewDate: '', reviewCount: 0, createdAt: '', updatedAt: '' }),
  deleteCard: async () => {},
  
  clearError: () => {}
});

interface FlashcardProviderProps {
  children: ReactNode;
}

export const FlashcardProvider: React.FC<FlashcardProviderProps> = ({ children }) => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDecks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedDecks = await decksApi.getAllDecks();
      setDecks(fetchedDecks);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch decks. Please try again.');
      console.error('Error fetching decks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeck = async (deckId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedDeck = await decksApi.getDeckById(deckId);
      setCurrentDeck(fetchedDeck);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch deck. Please try again.');
      console.error('Error fetching deck:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDeck = async (data: DeckCreateRequest): Promise<Deck> => {
    setIsLoading(true);
    setError(null);
    try {
      const newDeck = await decksApi.createDeck(data);
      setDecks(prev => [...prev, newDeck]);
      return newDeck;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create deck. Please try again.');
      console.error('Error creating deck:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateDeck = async (deckId: string, data: DeckUpdateRequest): Promise<Deck> => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedDeck = await decksApi.updateDeck(deckId, data);
      setDecks(prev => prev.map(deck => deck.id === deckId ? updatedDeck : deck));
      if (currentDeck?.id === deckId) {
        setCurrentDeck(updatedDeck);
      }
      return updatedDeck;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update deck. Please try again.');
      console.error('Error updating deck:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteDeck = async (deckId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await decksApi.deleteDeck(deckId);
      setDecks(prev => prev.filter(deck => deck.id !== deckId));
      if (currentDeck?.id === deckId) {
        setCurrentDeck(null);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete deck. Please try again.');
      console.error('Error deleting deck:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCards = async (deckId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCards = await cardsApi.getCardsByDeckId(deckId);
      setCards(fetchedCards);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch cards. Please try again.');
      console.error('Error fetching cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCard = async (deckId: string, cardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedCard = await cardsApi.getCardById(deckId, cardId);
      setCurrentCard(fetchedCard);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch card. Please try again.');
      console.error('Error fetching card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createCard = async (deckId: string, data: CardCreateRequest): Promise<Card> => {
    setIsLoading(true);
    setError(null);
    try {
      const newCard = await cardsApi.createCard(deckId, data);
      setCards(prev => [...prev, newCard]);
      
      // Update card count in the deck
      if (currentDeck && currentDeck.id === deckId) {
        setCurrentDeck({
          ...currentDeck,
          cardCount: currentDeck.cardCount + 1
        });
      }
      
      return newCard;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create card. Please try again.');
      console.error('Error creating card:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCard = async (deckId: string, cardId: string, data: CardUpdateRequest): Promise<Card> => {
    setIsLoading(true);
    setError(null);
    try {
      const updatedCard = await cardsApi.updateCard(deckId, cardId, data);
      setCards(prev => prev.map(card => card.id === cardId ? updatedCard : card));
      if (currentCard?.id === cardId) {
        setCurrentCard(updatedCard);
      }
      return updatedCard;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update card. Please try again.');
      console.error('Error updating card:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCard = async (deckId: string, cardId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await cardsApi.deleteCard(deckId, cardId);
      setCards(prev => prev.filter(card => card.id !== cardId));
      if (currentCard?.id === cardId) {
        setCurrentCard(null);
      }
      
      // Update card count in the deck
      if (currentDeck && currentDeck.id === deckId) {
        setCurrentDeck({
          ...currentDeck,
          cardCount: currentDeck.cardCount - 1
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete card. Please try again.');
      console.error('Error deleting card:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <FlashcardContext.Provider
      value={{
        decks,
        currentDeck,
        cards,
        currentCard,
        isLoading,
        error,
        fetchDecks,
        fetchDeck,
        createDeck,
        updateDeck,
        deleteDeck,
        fetchCards,
        fetchCard,
        createCard,
        updateCard,
        deleteCard,
        clearError
      }}
    >
      {children}
    </FlashcardContext.Provider>
  );
};