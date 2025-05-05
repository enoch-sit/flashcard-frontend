import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Header, Icon } from 'semantic-ui-react';
import DeckList from '../../components/decks/DeckList';

const DeckListPage: React.FC = () => {
  return (
    <Container>
      <Header as="h1" dividing>
        <Icon name="book" />
        <Header.Content>
          Flashcard Decks
          <Header.Subheader>Manage your flashcard decks</Header.Subheader>
        </Header.Content>
      </Header>
      
      <DeckList />
    </Container>
  );
};

export default DeckListPage;