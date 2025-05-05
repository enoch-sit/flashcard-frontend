import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Container, Header, Button, Icon, Segment, Loader, 
  Message, Grid, Statistic, Confirm, Divider
} from 'semantic-ui-react';
import httpClient from '../../api/http';
import { useDecks } from '../../hooks/useDecks';
import { Deck } from '../../types/deck';
import { Card } from '../../types/card';
import { formatDate } from '../../utils/dateUtils';
import CardList from '../../components/cards/CardList';

const DeckDetail: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { deleteDeck } = useDecks();
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchDeckDetails = async () => {
      if (!deckId) return;
      
      try {
        setLoading(true);
        
        // Fetch deck info
        const deckResponse = await httpClient.get(`/decks/${deckId}`);
        setDeck(deckResponse.data);
        
        // Fetch cards in deck
        const cardsResponse = await httpClient.get(`/decks/${deckId}/cards`);
        setCards(cardsResponse.data.cards || []);
        
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load deck details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeckDetails();
  }, [deckId]);

  const handleDeleteDeck = async () => {
    if (!deckId) return;
    
    try {
      const success = await deleteDeck(deckId);
      if (success) {
        navigate('/decks');
      }
    } catch (err) {
      console.error('Error deleting deck:', err);
    }
    
    setShowDeleteConfirm(false);
  };

  if (loading) {
    return (
      <Container>
        <Segment loading>
          <Header as="h2">Loading deck details...</Header>
        </Segment>
      </Container>
    );
  }

  if (error || !deck) {
    return (
      <Container>
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error || 'Deck not found'}</p>
        </Message>
        <Button onClick={() => navigate('/decks')}>Back to Decks</Button>
      </Container>
    );
  }

  return (
    <Container>
      <Header as="h1" dividing>
        {deck.name}
        <Header.Subheader>{deck.description}</Header.Subheader>
      </Header>
      
      <Grid stackable columns={2}>
        <Grid.Column width={10}>
          <Segment>
            <Button.Group fluid>
              <Button 
                primary 
                as={Link} 
                to={`/decks/${deckId}/study`}
                disabled={cards.length === 0}
              >
                <Icon name="play" />
                Study Deck
              </Button>
              <Button as={Link} to={`/decks/${deckId}/cards/new`}>
                <Icon name="plus" />
                Add Cards
              </Button>
              <Button as={Link} to={`/decks/${deckId}/edit`}>
                <Icon name="edit" />
                Edit Deck
              </Button>
              <Button negative onClick={() => setShowDeleteConfirm(true)}>
                <Icon name="trash" />
                Delete
              </Button>
            </Button.Group>
          </Segment>
          
          <Header as="h2">
            <Icon name="list" /> 
            Cards
          </Header>
          
          {cards.length === 0 ? (
            <Segment placeholder>
              <Header icon>
                <Icon name="file outline" />
                No Cards Yet
              </Header>
              <p>This deck doesn't have any flashcards yet.</p>
              <Button 
                primary 
                as={Link} 
                to={`/decks/${deckId}/cards/new`}
              >
                Add Your First Card
              </Button>
            </Segment>
          ) : (
            <CardList cards={cards} deckId={deckId} />
          )}
        </Grid.Column>
        
        <Grid.Column width={6}>
          <Segment>
            <Header as="h3">Deck Information</Header>
            
            <Statistic.Group widths={2}>
              <Statistic>
                <Statistic.Value>{cards.length}</Statistic.Value>
                <Statistic.Label>Cards</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>
                  {cards.filter(card => new Date(card.nextReviewDate) <= new Date()).length}
                </Statistic.Value>
                <Statistic.Label>Due for Review</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            
            <Divider />
            
            <p><strong>Created:</strong> {formatDate(deck.createdAt)}</p>
            <p><strong>Last Updated:</strong> {formatDate(deck.updatedAt)}</p>
            {deck.lastStudied && (
              <p><strong>Last Studied:</strong> {formatDate(deck.lastStudied)}</p>
            )}
          </Segment>
        </Grid.Column>
      </Grid>
      
      <Confirm
        open={showDeleteConfirm}
        header={`Delete ${deck.name}`}
        content={`Are you sure you want to delete this deck? This will also delete all ${cards.length} cards in this deck. This action cannot be undone.`}
        confirmButton="Delete Deck"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteDeck}
      />
    </Container>
  );
};

export default DeckDetail;