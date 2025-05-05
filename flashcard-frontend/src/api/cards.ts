import httpClient from './http';
import { Card, CardCreateRequest, CardUpdateRequest } from '../types/card';

export const getCardsByDeckId = async (deckId: string) => {
  const response = await httpClient.get(`/decks/${deckId}/cards`);
  return response.data;
};

export const getCardById = async (deckId: string, cardId: string) => {
  const response = await httpClient.get(`/decks/${deckId}/cards/${cardId}`);
  return response.data;
};

export const createCard = async (deckId: string, cardData: CardCreateRequest) => {
  const response = await httpClient.post(`/decks/${deckId}/cards`, cardData);
  return response.data;
};

export const updateCard = async (deckId: string, cardId: string, cardData: CardUpdateRequest) => {
  const response = await httpClient.put(`/decks/${deckId}/cards/${cardId}`, cardData);
  return response.data;
};

export const deleteCard = async (deckId: string, cardId: string) => {
  const response = await httpClient.delete(`/decks/${deckId}/cards/${cardId}`);
  return response.data;
};