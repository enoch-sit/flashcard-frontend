# React & TypeScript Frontend for Flashcard Application

Based on the API documentation and test suite provided, I'll design a detailed frontend blueprint using React, TypeScript, and Semantic UI. This blueprint will cover the architecture, key components, state management, and implementation details.

## Project Structure

```
src/
├── api/                  # API service layer
│   ├── auth.ts           # Authentication API calls
│   ├── cards.ts          # Card-related API calls
│   ├── decks.ts          # Deck-related API calls
│   ├── sessions.ts       # Study session API calls
│   └── http.ts           # Axios configuration with interceptors
├── components/           # Reusable UI components
│   ├── auth/             # Authentication-related components
│   ├── cards/            # Card-related components
│   ├── decks/            # Deck-related components
│   ├── study/            # Study session components
│   └── common/           # Shared UI components
├── contexts/             # React context providers
│   ├── AuthContext.tsx   # Authentication state management
│   └── FlashcardContext.tsx # Global app state
├── hooks/                # Custom React hooks
│   ├── useAuth.ts        # Authentication hooks
│   ├── useCards.ts       # Card management hooks
│   ├── useDecks.ts       # Deck management hooks
│   └── useStudy.ts       # Study session hooks
├── pages/                # Application pages/routes
│   ├── auth/             # Auth pages (login, register)
│   ├── dashboard/        # User dashboard
│   ├── decks/            # Deck management
│   ├── cards/            # Card management
│   ├── study/            # Study interface
│   └── stats/            # Statistics and analytics
├── types/                # TypeScript type definitions
│   ├── auth.ts           # Auth-related types
│   ├── card.ts           # Card-related types
│   ├── deck.ts           # Deck-related types
│   └── study.ts          # Study session types
├── utils/                # Utility functions
│   ├── tokenStorage.ts   # Token storage utilities
│   ├── dateUtils.ts      # Date formatting and calculations
│   └── validation.ts     # Form validation
└── App.tsx               # Main application component
```

## Type Definitions

Let's define the core TypeScript interfaces based on the API:

```typescript
// src/types/auth.ts
export interface User {
  id: string;
  username: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

// src/types/deck.ts
export interface Deck {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  createdAt: string;
  updatedAt: string;
  lastStudied?: string;
}

export interface DeckCreateRequest {
  name: string;
  description: string;
}

// src/types/card.ts
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

// src/types/study.ts
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
```

## API Service Layer

Let's implement the API service layer using Axios:

```typescript
// src/api/http.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { AuthTokens } from '../types/auth';
import { refreshToken, logout } from './auth';

const API_BASE_URL = 'http://localhost:3000/api';

const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
httpClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response interceptor for handling token expiration
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
  config: AxiosRequestConfig;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token && prom.config.headers) {
      prom.config.headers.Authorization = `Bearer ${token}`;
      prom.resolve(httpClient(prom.config));
    }
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't attempted a refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const storedRefreshToken = localStorage.getItem('refreshToken');
        if (!storedRefreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await refreshToken(storedRefreshToken);
        const { accessToken } = response;
        
        localStorage.setItem('accessToken', accessToken);
        
        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        processQueue(null, accessToken);
        
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError as AxiosError);
        // Clear tokens and redirect to login
        logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
```

Now let's implement the auth API service:

```typescript
// src/api/auth.ts
import httpClient from './http.ts';
import { AuthTokens } from '../types/auth';

export const signup = async (username: string, email: string, password: string) => {
  const response = await httpClient.post('/auth/signup', {
    username,
    email,
    password,
  });
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await httpClient.post('/auth/verify-email', { token });
  return response.data;
};

export const login = async (username: string, password: string): Promise<AuthTokens> => {
  const response = await httpClient.post('/auth/login', { username, password });
  
  // Store tokens
  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<AuthTokens> => {
  const response = await httpClient.post('/auth/refresh', { refreshToken });
  return response.data;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    try {
      await httpClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  
  // Clear tokens
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const requestPasswordReset = async (email: string) => {
  const response = await httpClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, newPassword: string) => {
  const response = await httpClient.post('/auth/reset-password', {
    token,
    newPassword,
  });
  return response.data;
};
```

## Authentication Context

Let's implement the authentication context to manage user state:

```typescript
// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthTokens } from '../types/auth';
import { login as apiLogin, logout as apiLogout } from '../api/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Get user profile
          const response = await fetch('/api/auth/profile', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // Token invalid
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const authTokens = await apiLogin(username, password);
      
      // Fetch user profile
      const response = await fetch('/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${authTokens.accessToken}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await apiLogout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

## Custom Hooks for API Calls

```typescript
// src/hooks/useDecks.ts
import { useState, useEffect } from 'react';
import { Deck, DeckCreateRequest } from '../types/deck';
import httpClient from '../api/http';

export const useDecks = () => {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.get('/decks');
      setDecks(response.data.decks);
    } catch (err) {
      setError('Failed to fetch decks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createDeck = async (deckData: DeckCreateRequest): Promise<Deck | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.post('/decks', deckData);
      const newDeck = response.data;
      setDecks([...decks, newDeck]);
      return newDeck;
    } catch (err) {
      setError('Failed to create deck');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateDeck = async (id: string, deckData: Partial<DeckCreateRequest>): Promise<Deck | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await httpClient.put(`/decks/${id}`, deckData);
      const updatedDeck = response.data;
      setDecks(decks.map(deck => deck.id === id ? updatedDeck : deck));
      return updatedDeck;
    } catch (err) {
      setError('Failed to update deck');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteDeck = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await httpClient.delete(`/decks/${id}`);
      setDecks(decks.filter(deck => deck.id !== id));
      return true;
    } catch (err) {
      setError('Failed to delete deck');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    decks,
    loading,
    error,
    fetchDecks,
    createDeck,
    updateDeck,
    deleteDeck,
  };
};
```

Similar hooks would be created for cards and study sessions.

## Key Components

### Authentication Components

```tsx
// src/components/auth/LoginForm.tsx
import React, { useState } from 'react';
import { Form, Button, Message } from 'semantic-ui-react';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    try {
      await login(username, password);
      // Redirect will be handled by router
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <Form onSubmit={handleSubmit} loading={isLoading} error={!!error}>
      <Message error content={error} />
      
      <Form.Field>
        <label>Username</label>
        <Form.Input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </Form.Field>
      
      <Form.Field>
        <label>Password</label>
        <Form.Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Form.Field>
      
      <Button primary type="submit" disabled={isLoading}>
        Login
      </Button>
    </Form>
  );
};

export default LoginForm;
```

### Deck Management Components

```tsx
// src/components/decks/DeckList.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Icon, Loader, Message } from 'semantic-ui-react';
import { useDecks } from '../../hooks/useDecks';
import { formatDate } from '../../utils/dateUtils';

const DeckList: React.FC = () => {
  const { decks, loading, error, fetchDecks } = useDecks();

  useEffect(() => {
    fetchDecks();
  }, []);

  if (loading && decks.length === 0) {
    return <Loader active>Loading decks...</Loader>;
  }

  if (error) {
    return <Message negative content={error} />;
  }

  if (decks.length === 0) {
    return (
      <Message info>
        <Message.Header>No decks found</Message.Header>
        <p>Create your first flashcard deck to get started!</p>
        <Button as={Link} to="/decks/new" primary>
          Create Deck
        </Button>
      </Message>
    );
  }

  return (
    <div>
      <Button as={Link} to="/decks/new" primary icon labelPosition="left">
        <Icon name="plus" />
        Create New Deck
      </Button>
      
      <Card.Group>
        {decks.map((deck) => (
          <Card key={deck.id}>
            <Card.Content>
              <Card.Header as={Link} to={`/decks/${deck.id}`}>
                {deck.name}
              </Card.Header>
              <Card.Meta>
                {deck.cardCount} cards • Created {formatDate(deck.createdAt)}
              </Card.Meta>
              <Card.Description>{deck.description}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                <Button basic color="green" as={Link} to={`/decks/${deck.id}/study`}>
                  Study
                </Button>
                <Button basic color="blue" as={Link} to={`/decks/${deck.id}/cards`}>
                  Manage Cards
                </Button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    </div>
  );
};

export default DeckList;
```

### Card Components

```tsx
// src/components/cards/CardForm.tsx
import React, { useState } from 'react';
import { Form, Button, TextArea, Divider } from 'semantic-ui-react';
import { CardCreateRequest } from '../../types/card';

interface CardFormProps {
  initialValues?: Partial<CardCreateRequest>;
  onSubmit: (cardData: CardCreateRequest) => Promise<void>;
  isLoading: boolean;
}

const CardForm: React.FC<CardFormProps> = ({ 
  initialValues = { front: '', back: '', notes: '' },
  onSubmit,
  isLoading
}) => {
  const [front, setFront] = useState(initialValues.front || '');
  const [back, setBack] = useState(initialValues.back || '');
  const [notes, setNotes] = useState(initialValues.notes || '');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!front.trim() || !back.trim()) {
      setError('Front and back content are required');
      return;
    }
    
    try {
      await onSubmit({
        front,
        back,
        notes: notes.trim() ? notes : undefined
      });
      
      // Reset form if it's for creating new cards
      if (!initialValues.front && !initialValues.back) {
        setFront('');
        setBack('');
        setNotes('');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save card');
    }
  };

  return (
    <Form onSubmit={handleSubmit} loading={isLoading} error={!!error}>
      <Form.Field required>
        <label>Front</label>
        <TextArea
          placeholder="Front side content"
          value={front}
          onChange={(e, { value }) => setFront(value as string)}
          rows={3}
        />
      </Form.Field>
      
      <Divider horizontal>Flip Card</Divider>
      
      <Form.Field required>
        <label>Back</label>
        <TextArea
          placeholder="Back side content"
          value={back}
          onChange={(e, { value }) => setBack(value as string)}
          rows={3}
        />
      </Form.Field>
      
      <Form.Field>
        <label>Notes (Optional)</label>
        <TextArea
          placeholder="Additional notes or context"
          value={notes}
          onChange={(e, { value }) => setNotes(value as string)}
          rows={2}
        />
      </Form.Field>
      
      <Button primary type="submit" disabled={isLoading}>
        {initialValues.front ? 'Update Card' : 'Create Card'}
      </Button>
    </Form>
  );
};

export default CardForm;
```

### Study Session Components

```tsx
// src/components/study/FlashcardReview.tsx
import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Icon, Segment } from 'semantic-ui-react';
import { Card as CardType } from '../../types/card';

interface FlashcardReviewProps {
  card: CardType;
  onReview: (result: number, timeSpent: number) => void;
  totalCards: number;
  currentCardIndex: number;
}

const FlashcardReview: React.FC<FlashcardReviewProps> = ({
  card,
  onReview,
  totalCards,
  currentCardIndex,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());
  
  // Reset startTime when card changes
  useEffect(() => {
    setIsFlipped(false);
    setStartTime(Date.now());
  }, [card.id]);
  
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };
  
  const handleReview = (result: number) => {
    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    onReview(result, timeSpent);
  };
  
  return (
    <div className="flashcard-review">
      <Progress 
        value={currentCardIndex + 1} 
        total={totalCards} 
        indicating 
        progress="ratio" 
        size="small"
      />
      
      <Card fluid onClick={handleFlip} className={isFlipped ? 'flipped' : ''}>
        <Card.Content>
          <Card.Header textAlign="center">
            {isFlipped ? 'Answer' : 'Question'}
          </Card.Header>
          <Card.Description textAlign="center" className="card-content">
            {isFlipped ? card.back : card.front}
          </Card.Description>
          {card.notes && isFlipped && (
            <Segment secondary size="small" className="card-notes">
              <Icon name="info circle" /> {card.notes}
            </Segment>
          )}
        </Card.Content>
        <Card.Content extra>
          <Button.Group fluid>
            <Button basic onClick={handleFlip}>
              <Icon name="refresh" />
              Flip Card
            </Button>
          </Button.Group>
        </Card.Content>
      </Card>
      
      {isFlipped && (
        <Segment>
          <p>How well did you know this?</p>
          <Button.Group fluid>
            <Button negative onClick={() => handleReview(0)}>
              Didn't Know
            </Button>
            <Button.Or />
            <Button color="yellow" onClick={() => handleReview(3)}>
              Somewhat Knew
            </Button>
            <Button.Or />
            <Button positive onClick={() => handleReview(5)}>
              Knew Well
            </Button>
          </Button.Group>
        </Segment>
      )}
    </div>
  );
};

export default FlashcardReview;
```

## Main Page Implementations

### Dashboard

```tsx
// src/pages/dashboard/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { Container, Header, Grid, Segment, Statistic, Icon, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useDecks } from '../../hooks/useDecks';
import DeckList from '../../components/decks/DeckList';
import RecentActivity from '../../components/study/RecentActivity';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { decks, loading, fetchDecks } = useDecks();
  const [studyStats, setStudyStats] = useState({
    cardsReviewed: 0,
    minutesStudied: 0,
    currentStreak: 0
  });
  
  useEffect(() => {
    fetchDecks();
    // Fetch study statistics
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/stats/study-activity');
        const data = await response.json();
        setStudyStats({
          cardsReviewed: data.totalCardsStudied,
          minutesStudied: data.totalTimeSpentMinutes,
          currentStreak: data.currentStreak
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <Container>
      <Header as="h1" dividing>
        Dashboard
        <Header.Subheader>
          Welcome back, {user?.username}!
        </Header.Subheader>
      </Header>
      
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width={16}>
            <Segment>
              <Statistic.Group widths={3}>
                <Statistic>
                  <Statistic.Value>{decks.length}</Statistic.Value>
                  <Statistic.Label>Decks</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>{studyStats.cardsReviewed}</Statistic.Value>
                  <Statistic.Label>Cards Reviewed</Statistic.Label>
                </Statistic>
                <Statistic>
                  <Statistic.Value>{studyStats.currentStreak}</Statistic.Value>
                  <Statistic.Label>Day Streak</Statistic.Label>
                </Statistic>
              </Statistic.Group>
            </Segment>
          </Grid.Column>
        </Grid.Row>
        
        <Grid.Row>
          <Grid.Column width={10}>
            <Header as="h2">
              <Icon name="book" />
              <Header.Content>My Decks</Header.Content>
            </Header>
            <DeckList />
          </Grid.Column>
          
          <Grid.Column width={6}>
            <Header as="h2">
              <Icon name="chart line" />
              <Header.Content>Recent Activity</Header.Content>
            </Header>
            <RecentActivity />
            
            <Segment placeholder>
              <Header icon>
                <Icon name="time" />
                Study Reminder
              </Header>
              <p>You have cards due for review in 3 decks.</p>
              <Button primary as={Link} to="/study">Start Studying</Button>
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Container>
  );
};

export default Dashboard;
```

### Study Page

```tsx
// src/pages/study/StudySession.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Header, Segment, Button, Icon, Message, Modal } from 'semantic-ui-react';
import httpClient from '../../api/http';
import FlashcardReview from '../../components/study/FlashcardReview';
import StudySessionSummary from '../../components/study/StudySessionSummary';
import { Card, CardReviewRequest } from '../../types/card';

interface RouteParams {
  deckId: string;
}

const StudySession: React.FC = () => {
  const { deckId } = useParams<RouteParams>();
  const navigate = useNavigate();
  
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [deckName, setDeckName] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewedCards, setReviewedCards] = useState<Record<string, number>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [showSummary, setShowSummary] = useState(false);
  
  // Start study session
  useEffect(() => {
    const startSession = async () => {
      setIsLoading(true);
      try {
        // Start the session
        const sessionResponse = await httpClient.post(`/decks/${deckId}/study-sessions`);
        setSessionId(sessionResponse.data.sessionId);
        setDeckName(sessionResponse.data.deckName);
        
        // Get due cards
        const cardsResponse = await httpClient.get(`/decks/${deckId}/review-cards`);
        setCards(cardsResponse.data.cards);
        
        if (cardsResponse.data.cards.length === 0) {
          setError('No cards due for review in this deck.');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to start study session');
      } finally {
        setIsLoading(false);
      }
    };
    
    startSession();
  }, [deckId]);
  
  const handleReview = async (result: number, timeSpent: number) => {
    if (!sessionId || !cards[currentCardIndex]) return;
    
    const cardId = cards[currentCardIndex].id;
    
    // Store result and time
    setReviewedCards({
      ...reviewedCards,
      [cardId]: result
    });
    
    setTimeSpent({
      ...timeSpent,
      [cardId]: timeSpent
    });
    
    // Submit review to API
    try {
      const reviewData: CardReviewRequest = {
        card: { id: cardId },
        result,
        timeSpentSeconds: timeSpent
      };
      
      await httpClient.post(`/study-sessions/${sessionId}/reviews`, reviewData);
      
      // Move to next card
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1);
      } else {
        // End of session
        setShowSummary(true);
      }
      
    } catch (err) {
      console.error('Failed to submit review:', err);
    }
  };
  
  const handleCompleteSession = async () => {
    if (!sessionId) return;
    
    try {
      // Calculate statistics
      const totalCards = Object.keys(reviewedCards).length;
      const correctResponses = Object.values(reviewedCards).filter(r => r > 0).length;
      const incorrectResponses = totalCards - correctResponses;
      const totalTimeSeconds = Object.values(timeSpent).reduce((sum, time) => sum + time, 0);
      
      await httpClient.put(`/study-sessions/${sessionId}/complete`, {
        cardsReviewed: totalCards,
        correctResponses,
        incorrectResponses, 
        totalTimeSeconds
      });
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Failed to complete session:', err);
    }
  };
  
  if (isLoading) {
    return (
      <Container text>
        <Segment loading>
          <Header as="h2">Preparing study session...</Header>
        </Segment>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container text>
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
        <Button icon labelPosition="left" onClick={() => navigate('/dashboard')}>
          <Icon name="arrow left" />
          Back to Dashboard
        </Button>
      </Container>
    );
  }
  
  if (cards.length === 0) {
    return (
      <Container text>
        <Segment placeholder>
          <Header icon>
            <Icon name="check circle" />
            All caught up!
          </Header>
          <p>You don't have any cards due for review in this deck.</p>
          <Button primary onClick={() => navigate(`/decks/${deckId}`)}>
            Back to Deck
          </Button>
        </Segment>
      </Container>
    );
  }
  
  return (
    <Container text>
      <Header as="h2">
        Studying: {deckName}
        <Button 
          floated="right" 
          icon="close" 
          color="red" 
          size="tiny"
          onClick={() => setShowSummary(true)}
        />
      </Header>
      
      {!showSummary ? (
        <FlashcardReview
          card={cards[currentCardIndex]}
          onReview={handleReview}
          totalCards={cards.length}
          currentCardIndex={currentCardIndex}
        />
      ) : (
        <Modal open={showSummary} onClose={() => setShowSummary(false)}>
          <Modal.Header>Study Session Summary</Modal.Header>
          <Modal.Content>
            <StudySessionSummary
              totalCards={cards.length}
              reviewedCards={reviewedCards}
              timeSpent={timeSpent}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={handleCompleteSession}>
              <Icon name="check" />
              Complete Session
            </Button>
          </Modal.Actions>
        </Modal>
      )}
    </Container>
  );
};

export default StudySession;
```

## Styling with CSS

Create a `styles.css` file to enhance the flashcard experience:

```css
/* src/styles/flashcard.css */
.flashcard-container {
  perspective: 1000px;
  margin: 20px 0;
}

.flashcard {
  position: relative;
  transition: transform 0.6s;
  transform-style: preserve-3d;
  height: 300px;
}

.flashcard.flipped {
  transform: rotateY(180deg);
}

.card-front, .card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  border-radius: 8px;
}

.card-front {
  background-color: #f9f9f9;
}

.card-back {
  background-color: #f5f5f5;
  transform: rotateY(180deg);
}

.card-content {
  font-size: 1.5rem;
  text-align: center;
  max-height: 200px;
  overflow-y: auto;
}

.card-notes {
  margin-top: 15px;
  font-size: 0.9rem;
  font-style: italic;
}

.confidence-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

/* Animation for card transition */
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-enter {
  animation: cardEnter 0.3s ease-out;
}
```

## Router Configuration

```tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';

// Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/dashboard/Dashboard';
import DeckList from './pages/decks/DeckList';
import DeckDetail from './pages/decks/DeckDetail';
import DeckCreate from './pages/decks/DeckCreate';
import DeckEdit from './pages/decks/DeckEdit';
import CardList from './pages/cards/CardList';
import CardDetail from './pages/cards/CardDetail';
import CardCreate from './pages/cards/CardCreate';
import CardEdit from './pages/cards/CardEdit';
import StudySession from './pages/study/StudySession';
import StudyHistory from './pages/study/StudyHistory';
import Statistics from './pages/stats/Statistics';

// Components
import Navbar from './components/common/Navbar';
import PrivateRoute from './components/common/PrivateRoute';

// CSS
import 'semantic-ui-css/semantic.min.css';
import './styles/app.css';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Container className="main-container">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
            <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
            
            {/* Deck routes */}
            <Route path="/decks" element={<PrivateRoute element={<DeckList />} />} />
            <Route path="/decks/new" element={<PrivateRoute element={<DeckCreate />} />} />
            <Route path="/decks/:deckId" element={<PrivateRoute element={<DeckDetail />} />} />
            <Route path="/decks/:deckId/edit" element={<PrivateRoute element={<DeckEdit />} />} />
            
            {/* Card routes */}
            <Route path="/decks/:deckId/cards" element={<PrivateRoute element={<CardList />} />} />
            <Route path="/decks/:deckId/cards/new" element={<PrivateRoute element={<CardCreate />} />} />
            <Route path="/decks/:deckId/cards/:cardId" element={<PrivateRoute element={<CardDetail />} />} />
            <Route path="/decks/:deckId/cards/:cardId/edit" element={<PrivateRoute element={<CardEdit />} />} />
            
            {/* Study routes */}
            <Route path="/decks/:deckId/study" element={<PrivateRoute element={<StudySession />} />} />
            <Route path="/study-history" element={<PrivateRoute element={<StudyHistory />} />} />
            
            {/* Statistics */}
            <Route path="/stats" element={<PrivateRoute element={<Statistics />} />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Container>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
```

## Implementation Considerations

1. **Token Management**
   - JWT tokens are stored in localStorage for persistence
   - Refreshing mechanism is implemented to handle token expiration
   - Security considerations include token validation and proper error handling

2. **Performance Optimization**
   - React memo and useCallback for optimizing renders
   - Pagination for large data sets (decks and cards)
   - Lazy loading of components for improved initial load time

3. **Error Handling**
   - Comprehensive error handling for API calls
   - User-friendly error messages
   - Fallback UIs for network failures

4. **Accessibility**
   - Semantic HTML structure
   - ARIA attributes for interactive components
   - Keyboard navigation support

5. **Responsive Design**
   - Semantic UI responsive grid system
   - Mobile-first approach
   - Flexible flashcard layouts that work on all screen sizes

## Development Workflow

1. **Set up project**

   ```bash
   npx create-react-app flashcard-app --template typescript
   cd flashcard-app
   npm install semantic-ui-react semantic-ui-css axios react-router-dom
   ```

2. **Configure ESLint and Prettier**

   ```bash
   npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier
   ```

3. **Create folder structure and implement core files**

4. **Implement authentication first**
   - Set up the auth context and API integration
   - Build login, register, and verification flows

5. **Build core Deck management components**

6. **Implement Card management**

7. **Develop the Study session functionality**

8. **Add analytics and statistics components**

This blueprint provides a comprehensive foundation for building a modern, responsive flashcard application with React, TypeScript, and Semantic UI. The architecture follows best practices for maintainability, performance, and user experience.
