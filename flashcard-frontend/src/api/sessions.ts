import httpClient from './http';
import { CardReviewRequest, CompleteSessionRequest } from '../types/study';

export const startStudySession = async (deckId: string) => {
  const response = await httpClient.post(`/study/start/${deckId}`);
  return response.data;
};

export const getCardsToReview = async (deckId: string) => {
  const response = await httpClient.get(`/study/cards-due/${deckId}`);
  return response.data;
};

export const submitCardReview = async (sessionId: string, reviewData: CardReviewRequest) => {
  const response = await httpClient.post(`/study/sessions/${sessionId}/review`, reviewData);
  return response.data;
};

export const completeStudySession = async (sessionId: string, data: CompleteSessionRequest) => {
  const response = await httpClient.post(`/study/sessions/${sessionId}/complete`, data);
  return response.data;
};

export const getStudySessions = async (limit?: number, offset?: number) => {
  const params = { limit, offset };
  const response = await httpClient.get('/study/sessions', { params });
  return response.data;
};

export const getSessionById = async (sessionId: string) => {
  const response = await httpClient.get(`/study/sessions/${sessionId}`);
  return response.data;
};

export const getStudyStatistics = async (period?: string) => {
  const params = { period };
  const response = await httpClient.get('/study/statistics', { params });
  return response.data;
};