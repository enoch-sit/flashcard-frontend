export interface Deck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
  lastStudied?: string;
  dueCardCount?: number; // Adding the missing dueCardCount property
}

export interface DeckCreateRequest {
  name: string;
  description: string;
}

export interface DeckUpdateRequest {
  name?: string;
  description?: string;
}