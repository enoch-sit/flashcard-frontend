import httpClient from './http';
import { Deck, DeckCreateRequest, DeckUpdateRequest } from '../types/deck';

export const getAllDecks = async () => {
  const response = await httpClient.get('/decks');
  return response.data;
};

export const getDeckById = async (deckId: string) => {
  const response = await httpClient.get(`/decks/${deckId}`);
  return response.data;
};

export const createDeck = async (deckData: DeckCreateRequest) => {
  const response = await httpClient.post('/decks', deckData);
  return response.data;
};

export const updateDeck = async (deckId: string, deckData: DeckUpdateRequest) => {
  const response = await httpClient.put(`/decks/${deckId}`, deckData);
  return response.data;
};

export const deleteDeck = async (deckId: string) => {
  const response = await httpClient.delete(`/decks/${deckId}`);
  return response.data;
};