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
  tags?: string[]; // Adding the missing tags property
}

export interface CardCreateRequest {
  front: string;
  back: string;
  notes?: string;
  tags?: string[];
}

export interface CardUpdateRequest {
  front?: string;
  back?: string;
  notes?: string;
  tags?: string[];
}