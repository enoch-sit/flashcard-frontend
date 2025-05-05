export interface Card {
  id: string;
  front: string;
  back: string;
  notes?: string;
  difficulty: number;
  nextReviewDate: string;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CardCreateRequest {
  front: string;
  back: string;
  notes?: string;
}

export interface CardUpdateRequest {
  front?: string;
  back?: string;
  notes?: string;
}