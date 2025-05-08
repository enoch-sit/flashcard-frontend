import { useState } from 'react';
import * as sessionsApi from '../api/sessions';
import { Card } from '../types/card';
import { CardReviewRequest, CompleteSessionRequest, StudySession, StudyStatistics } from '../types/study';

const useStudy = () => {
  const [cardsToReview, setCardsToReview] = useState<Card[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [studySessions, setStudySessions] = useState<StudySession[]>([]);
  const [recentSessions, setRecentSessions] = useState<any[]>([]); // Adding recentSessions state
  const [upcomingReviewCount, setUpcomingReviewCount] = useState<number>(0); // Adding upcomingReviewCount state
  const [cardsToStudy, setCardsToStudy] = useState<Card[]>([]); // Adding cardsToStudy state
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null);
  const [statistics, setStatistics] = useState<StudyStatistics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Add fetchRecentSessions function
  const fetchRecentSessions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // In a real implementation, this would call an API endpoint
      // For now, we'll use the existing getStudySessions as a placeholder
      const sessions = await sessionsApi.getStudySessions(10, 0);
      setRecentSessions(sessions);
      
      // Mock upcoming review count calculation
      // In a real implementation, this would be returned from the API
      setUpcomingReviewCount(Math.floor(Math.random() * 20));
      
      return sessions;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch recent sessions. Please try again.');
      console.error('Error fetching recent sessions:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const startStudySession = async (deckId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await sessionsApi.startStudySession(deckId);
      setCurrentSessionId(session.id);
      
      // Fetch cards to review for this session
      const cards = await sessionsApi.getCardsToReview(deckId);
      setCardsToReview(cards);
      setCardsToStudy(cards); // Set cards to study as well
      
      return { session, cards };
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to start study session. Please try again.');
      console.error('Error starting study session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const submitCardReview = async (sessionId: string, reviewData: CardReviewRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await sessionsApi.submitCardReview(sessionId, reviewData);
      return response;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to submit card review. Please try again.');
      console.error('Error submitting card review:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const completeStudySession = async (sessionId: string, data: CompleteSessionRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const completedSession = await sessionsApi.completeStudySession(sessionId, data);
      setCurrentSessionId(null);
      setCardsToReview([]);
      return completedSession;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to complete study session. Please try again.');
      console.error('Error completing study session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getStudySessions = async (limit?: number, offset?: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const sessions = await sessionsApi.getStudySessions(limit, offset);
      setStudySessions(sessions);
      return sessions;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch study sessions. Please try again.');
      console.error('Error fetching study sessions:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getSessionById = async (sessionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await sessionsApi.getSessionById(sessionId);
      setCurrentSession(session);
      return session;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch study session. Please try again.');
      console.error('Error fetching study session:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getStudyStatistics = async (period?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const stats = await sessionsApi.getStudyStatistics(period);
      setStatistics(stats);
      return stats;
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch study statistics. Please try again.');
      console.error('Error fetching study statistics:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    cardsToReview,
    currentSessionId,
    studySessions,
    currentSession,
    statistics,
    isLoading,
    error,
    startStudySession,
    submitCardReview,
    completeStudySession,
    getStudySessions,
    getSessionById,
    getStudyStatistics,
    clearError,
    // Add new properties to the return object
    recentSessions,
    upcomingReviewCount,
    fetchRecentSessions,
    cardsToStudy
  };
};

export default useStudy;