import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Header, Button, Icon, Segment, Message, Loader } from 'semantic-ui-react';
import httpClient from '../../api/http';
import { Card } from '../../types/card';

const CardList: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  
  const [cards, setCards] = useState<Card[]>([]);
  const [deckName, setDeckName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCards = async () => {
      if (!deckId) return;
      
      try {
        setLoading(true);
        
        // Fetch deck info to get the name
        const deckResponse = await httpClient.get(`/decks/${deckId}`);
        setDeckName(deckResponse.data.name);
        
        // Fetch all cards in the deck
        const cardsResponse = await httpClient.get(`/decks/${deckId}/cards`);
        setCards(cardsResponse.data.cards || []);
        
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load cards');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCards();
  }, [deckId]);

  const handleDeleteCard = async (cardId: string) => {
    if (!deckId) return;
    
    try {
      await httpClient.delete(`/decks/${deckId}/cards/${cardId}`);
      setCards(cards.filter(card => card.id !== cardId));
    } catch (err) {
      console.error('Error deleting card:', err);
    }
  };

  if (loading) {
    return (
      <Container>
        <Loader active>Loading cards...</Loader>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
        <Button onClick={() => navigate('/decks')}>Back to Decks</Button>
      </Container>
    );
  }

  return (
    <Container>
      <Header as="h1" dividing>
        <Icon name="list" />
        <Header.Content>
          Cards in {deckName}
          <Header.Subheader>Manage flashcards in this deck</Header.Subheader>
        </Header.Content>
      </Header>
      
      <Button.Group>
        <Button icon labelPosition="left" onClick={() => navigate(`/decks/${deckId}`)}>
          <Icon name="arrow left" />
          Back to Deck
        </Button>
        <Button primary icon labelPosition="left" as={Link} to={`/decks/${deckId}/cards/new`}>
          <Icon name="plus" />
          Add Card
        </Button>
      </Button.Group>
      
      {cards.length === 0 ? (
        <Segment placeholder>
          <Header icon>
            <Icon name="file outline" />
            No Cards
          </Header>
          <p>This deck doesn't have any flashcards yet.</p>
          <Button primary as={Link} to={`/decks/${deckId}/cards/new`}>
            Create Your First Card
          </Button>
        </Segment>
      ) : (
        <Segment.Group>
          {cards.map(card => (
            <Segment key={card.id}>
              <Button 
                floated="right" 
                color="red" 
                size="tiny"
                icon="trash"
                onClick={() => handleDeleteCard(card.id)}
              />
              <Button 
                floated="right" 
                size="tiny"
                icon="edit"
                as={Link}
                to={`/decks/${deckId}/cards/${card.id}/edit`}
              />
              <Header as="h4" onClick={() => navigate(`/decks/${deckId}/cards/${card.id}`)}>
                <div style={{ cursor: 'pointer' }}>
                  {card.front.substring(0, 70)}{card.front.length > 70 ? '...' : ''}
                </div>
                <Header.Subheader>
                  Difficulty: {card.difficulty} • Reviews: {card.reviewCount}
                </Header.Subheader>
              </Header>
            </Segment>
          ))}
        </Segment.Group>
      )}
    </Container>
  );
};

export default CardList;