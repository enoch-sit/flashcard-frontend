import React, { useState } from 'react';
import { Container, Header, Form, Button, Icon, Message } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import  useDecks  from '../../hooks/useDecks';
import { DeckCreateRequest } from '../../types/deck';

const DeckCreate: React.FC = () => {
  const navigate = useNavigate();
  const { createDeck, isLoading, error } = useDecks();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!name.trim()) {
      setFormError('Please enter a deck name');
      return;
    }
    
    try {
      const newDeck = await createDeck({
        name: name.trim(),
        description: description.trim()
      });
      
      if (newDeck) {
        navigate(`/decks/${newDeck.id}`);
      }
    } catch (err: any) {
      setFormError(err.message || 'Failed to create deck');
    }
  };

  return (
    <Container text>
      <Header as="h1">
        <Icon name="plus" />
        <Header.Content>
          Create New Deck
          <Header.Subheader>Add a new flashcard deck</Header.Subheader>
        </Header.Content>
      </Header>
      
      {(error || formError) && (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{formError || error}</p>
        </Message>
      )}
      
      <Form onSubmit={handleSubmit} loading={isLoading}>
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
          <Button type="button" onClick={() => navigate('/decks')}>
            Cancel
          </Button>
          <Button.Or />
          <Button primary type="submit" disabled={isLoading}>
            Create Deck
          </Button>
        </Button.Group>
      </Form>
    </Container>
  );
};

export default DeckCreate;