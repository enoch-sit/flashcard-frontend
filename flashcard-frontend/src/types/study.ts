export interface StudySession {
  id: string;
  deckId: string;
  deckName: string;
  startedAt: string;
  completedAt?: string;
  cardsStudied: number;
  cardsCorrect: number;
  timeSpentSeconds: number;
}

export interface CardReview {
  id: string;
  cardId: string;
  sessionId: string;
  result: number; // 0-5 scale
  timeSpentSeconds: number;
  reviewedAt: string;
  nextReviewDate?: string;
}

export interface CardReviewRequest {
  card: {
    id: string;
  };
  result: number;
  timeSpentSeconds: number;
}

export interface CompleteSessionRequest {
  cardsReviewed: number;
  correctResponses: number;
  incorrectResponses: number;
  totalTimeSeconds: number;
}

export interface StudyStatistics {
  period: string;
  completedSessions: number;
  totalCardsStudied: number;
  totalTimeSpentMinutes: number;
  averageCorrectPercentage: number;
  currentStreak: number;
  longestStreak: number;
}