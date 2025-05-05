import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, Header, Button, Icon, Segment, Message, 
  Grid, Card, Label, Statistic, Divider, Confirm
} from 'semantic-ui-react';
import httpClient from '../../api/http';
import { Card as CardType } from '../../types/card';
import { formatDate } from '../../utils/dateUtils';

const CardDetail: React.FC = () => {
  const { deckId, cardId } = useParams<{ deckId: string; cardId: string }>();
  const navigate = useNavigate();
  
  const [card, setCard] = useState<CardType | null>(null);
  const [deckName, setDeckName] = useState('');
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchCardDetails = async () => {
      if (!deckId || !cardId) return;
      
      try {
        setLoading(true);
        
        // Fetch the card details
        const cardResponse = await httpClient.get(`/decks/${deckId}/cards/${cardId}`);
        setCard(cardResponse.data);
        
        // Fetch deck name
        const deckResponse = await httpClient.get(`/decks/${deckId}`);
        setDeckName(deckResponse.data.name);
        
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load card details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCardDetails();
  }, [deckId, cardId]);

  const handleDeleteCard = async () => {
    if (!deckId || !cardId) return;
    
    try {
      await httpClient.delete(`/decks/${deckId}/cards/${cardId}`);
      navigate(`/decks/${deckId}`);
    } catch (err) {
      console.error('Error deleting card:', err);
    }
    
    setShowDeleteConfirm(false);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (loading) {
    return (
      <Container text>
        <Segment loading>
          <Header as="h2">Loading card details...</Header>
        </Segment>
      </Container>
    );
  }

  if (error || !card) {
    return (
      <Container text>
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error || 'Card not found'}</p>
        </Message>
        <Button onClick={() => navigate(`/decks/${deckId}`)}>
          Back to Deck
        </Button>
      </Container>
    );
  }

  return (
    <Container text>
      <Header as="h1" dividing>
        <Icon name="file alternate" />
        <Header.Content>
          Flashcard
          <Header.Subheader>From deck: {deckName}</Header.Subheader>
        </Header.Content>
      </Header>
      
      <Button.Group>
        <Button onClick={() => navigate(`/decks/${deckId}`)}>
          <Icon name="arrow left" /> Back to Deck
        </Button>
        <Button primary as={Link} to={`/decks/${deckId}/cards/${cardId}/edit`}>
          <Icon name="edit" /> Edit Card
        </Button>
        <Button negative onClick={() => setShowDeleteConfirm(true)}>
          <Icon name="trash" /> Delete Card
        </Button>
      </Button.Group>
      
      <div className="flashcard-container" style={{ margin: '2rem 0' }}>
        <Card fluid className={isFlipped ? 'flipped' : ''}>
          <Card.Content onClick={handleFlip}>
            <Card.Header textAlign="center">
              {isFlipped ? 'Back Side' : 'Front Side'}
            </Card.Header>
            <Card.Description textAlign="center" style={{ minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>
                {isFlipped ? card.back : card.front}
              </div>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Button fluid basic onClick={handleFlip}>
              <Icon name="refresh" /> Flip Card
            </Button>
          </Card.Content>
        </Card>
      </div>
      
      {card.notes && (
        <Segment secondary>
          <Header as="h4">Notes</Header>
          <p>{card.notes}</p>
        </Segment>
      )}
      
      <Segment>
        <Grid columns={2} divided>
          <Grid.Row>
            <Grid.Column>
              <Header as="h4">Card Statistics</Header>
              <p><strong>Difficulty:</strong> {card.difficulty}</p>
              <p><strong>Review Count:</strong> {card.reviewCount}</p>
            </Grid.Column>
            <Grid.Column>
              <Header as="h4">Dates</Header>
              <p><strong>Created:</strong> {formatDate(card.createdAt)}</p>
              <p><strong>Last Updated:</strong> {formatDate(card.updatedAt)}</p>
              <p><strong>Next Review:</strong> {formatDate(card.nextReviewDate)}</p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
      
      <Confirm
        open={showDeleteConfirm}
        header="Delete Card"
        content="Are you sure you want to delete this flashcard? This action cannot be undone."
        confirmButton="Delete"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteCard}
      />
    </Container>
  );
};

export default CardDetail;