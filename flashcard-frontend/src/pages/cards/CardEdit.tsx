import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Header, Button, Icon, Segment, Message } from 'semantic-ui-react';
import httpClient from '../../api/http';
import CardForm from '../../components/cards/CardForm';
import { Card, CardCreateRequest, CardUpdateRequest } from '../../types/card';

const CardEdit: React.FC = () => {
  const { deckId, cardId } = useParams<{ deckId: string; cardId: string }>();
  const navigate = useNavigate();
  
  const [card, setCard] = useState<Card | null>(null);
  const [deckName, setDeckName] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (!deckId || !cardId) return;
      
      try {
        setFetchLoading(true);
        
        // Fetch card details
        const cardResponse = await httpClient.get(`/decks/${deckId}/cards/${cardId}`);
        setCard(cardResponse.data);
        
        // Fetch deck name
        const deckResponse = await httpClient.get(`/decks/${deckId}`);
        setDeckName(deckResponse.data.name);
        
      } catch (err: any) {
        setFetchError(err.response?.data?.message || 'Failed to load card details');
      } finally {
        setFetchLoading(false);
      }
    };
    
    fetchCardDetails();
  }, [deckId, cardId]);

  const handleUpdateCard = async (cardData: CardCreateRequest | CardUpdateRequest): Promise<any> => {
    if (!deckId || !cardId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await httpClient.put(`/decks/${deckId}/cards/${cardId}`, cardData);
      setCard(response.data);
      navigate(`/decks/${deckId}/cards/${cardId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update card');
      throw err; // Re-throw to let the form component handle it
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Container text>
        <Segment loading>
          <Header as="h2">Loading card details...</Header>
        </Segment>
      </Container>
    );
  }

  if (fetchError || !card) {
    return (
      <Container text>
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{fetchError || 'Card not found'}</p>
        </Message>
        <Button onClick={() => navigate(`/decks/${deckId}`)}>Back to Deck</Button>
      </Container>
    );
  }

  return (
    <Container text>
      <Header as="h1" dividing>
        <Icon name="edit" />
        <Header.Content>
          Edit Card
          <Header.Subheader>Update flashcard in {deckName}</Header.Subheader>
        </Header.Content>
      </Header>
      
      {error && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      )}
      
      <CardForm 
        deckId={deckId || ''}
        initialValues={card}
        onSubmit={handleUpdateCard}
        isLoading={loading}
        error={error}
        mode="edit"
      />
      
      <div style={{ marginTop: '2rem', textAlign: 'right' }}>
        <Button.Group>
          <Button onClick={() => navigate(`/decks/${deckId}/cards/${cardId}`)}>
            Cancel
          </Button>
          <Button.Or />
          <Button negative onClick={() => navigate(`/decks/${deckId}`)}>
            Back to Deck
          </Button>
        </Button.Group>
      </div>
    </Container>
  );
};

export default CardEdit;