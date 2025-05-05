import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Header, Button, Icon, Segment, Message } from 'semantic-ui-react';
import httpClient from '../../api/http';
import CardForm from '../../components/cards/CardForm';
import { CardCreateRequest } from '../../types/card';

const CardCreate: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const [deckName, setDeckName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingDeck, setLoadingDeck] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deckError, setDeckError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeckInfo = async () => {
      if (!deckId) return;
      
      try {
        const response = await httpClient.get(`/decks/${deckId}`);
        setDeckName(response.data.name);
      } catch (err: any) {
        setDeckError(err.response?.data?.message || 'Failed to load deck information');
      } finally {
        setLoadingDeck(false);
      }
    };
    
    fetchDeckInfo();
  }, [deckId]);

  const handleCreateCard = async (cardData: CardCreateRequest) => {
    if (!deckId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      await httpClient.post(`/decks/${deckId}/cards`, cardData);
      // Success message or notification could be added here
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create card');
      throw err; // Re-throw to let the form component handle it
    } finally {
      setLoading(false);
    }
  };

  if (loadingDeck) {
    return (
      <Container text>
        <Segment loading>
          <Header as="h2">Loading deck information...</Header>
        </Segment>
      </Container>
    );
  }

  if (deckError) {
    return (
      <Container text>
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{deckError}</p>
        </Message>
        <Button onClick={() => navigate('/decks')}>Back to Decks</Button>
      </Container>
    );
  }

  return (
    <Container text>
      <Header as="h1" dividing>
        <Icon name="plus" />
        <Header.Content>
          Create New Card
          <Header.Subheader>Add a new flashcard to {deckName}</Header.Subheader>
        </Header.Content>
      </Header>
      
      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      )}
      
      <CardForm 
        onSubmit={handleCreateCard}
        isLoading={loading}
      />
      
      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <Button onClick={() => navigate(`/decks/${deckId}`)}>
          Back to Deck
        </Button>
      </div>
    </Container>
  );
};

export default CardCreate;