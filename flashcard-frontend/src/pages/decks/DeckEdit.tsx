import React, { useState, useEffect } from 'react';
import { Container, Header, Form, Button, Icon, Message, Segment, Loader } from 'semantic-ui-react';
import { useParams, useNavigate } from 'react-router-dom';
import useDecks from '../../hooks/useDecks';
import { Deck } from '../../types/deck';
import httpClient from '../../api/http';

const DeckEdit: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { updateDeck, isLoading: updateLoading, error: updateError } = useDecks();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeck = async () => {
      if (!deckId) return;
      
      try {
        const response = await httpClient.get(`/decks/${deckId}`);
        const deck: Deck = response.data;
        
        setName(deck.name);
        setDescription(deck.description);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load deck');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeck();
  }, [deckId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!name.trim()) {
      setFormError('Please enter a deck name');
      return;
    }
    
    if (!deckId) return;
    
    try {
      const updatedDeck = await updateDeck(deckId, {
        name: name.trim(),
        description: description.trim()
      });
      
      if (updatedDeck) {
        navigate(`/decks/${deckId}`);
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to update deck');
    }
  };

  if (loading) {
    return (
      <Container text>
        <Segment loading>
          <Header as="h2">Loading deck...</Header>
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
        <Button onClick={() => navigate('/decks')}>Back to Decks</Button>
      </Container>
    );
  }

  return (
    <Container text>
      <Header as="h1">
        <Icon name="edit" />
        <Header.Content>
          Edit Deck
          <Header.Subheader>Update deck information</Header.Subheader>
        </Header.Content>
      </Header>
      
      {(updateError || formError) && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{formError || updateError}</p>
        </Message>
      )}
      
      <Form onSubmit={handleSubmit} loading={updateLoading}>
        <Form.Field required>
          <label>Deck Name</label>
          <Form.Input 
            placeholder="Enter deck name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Field>
        
        <Form.Field>
          <label>Description</label>
          <Form.TextArea
            placeholder="Enter deck description"
            value={description}
            onChange={(e, { value }) => setDescription(value as string)}
          />
        </Form.Field>
        
        <Button.Group>
          <Button type="button" onClick={() => navigate(`/decks/${deckId}`)}>
            Cancel
          </Button>
          <Button.Or />
          <Button primary type="submit" disabled={updateLoading}>
            Save Changes
          </Button>
        </Button.Group>
      </Form>
    </Container>
  );
};

export default DeckEdit;