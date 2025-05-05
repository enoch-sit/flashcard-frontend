import React, { useEffect, useState } from 'react';
import { Container, Header, Segment, Table, Icon, Message, Loader, Menu, Dropdown, Grid } from 'semantic-ui-react';
import { useNavigate, Link } from 'react-router-dom';
import httpClient from '../../api/http';
import { StudySession } from '../../types/study';
import { formatDate } from '../../utils/dateUtils';

const StudyHistory: React.FC = () => {
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('all'); // all, week, month
  const [sortField, setSortField] = useState('startedAt');
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('descending');

  useEffect(() => {
    const fetchStudyHistory = async () => {
      try {
        setLoading(true);
        
        // Fetch study sessions
        const response = await httpClient.get('/study-sessions');
        setSessions(response.data.sessions || []);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load study history');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudyHistory();
  }, []);

  const getFilteredSessions = () => {
    let filteredSessions = [...sessions];
    
    // Apply time filter
    const now = new Date();
    if (filter === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      filteredSessions = filteredSessions.filter(
        session => new Date(session.startedAt) >= weekAgo
      );
    } else if (filter === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setMonth(now.getMonth() - 1);
      filteredSessions = filteredSessions.filter(
        session => new Date(session.startedAt) >= monthAgo
      );
    }
    
    // Apply sorting
    filteredSessions.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case 'deckName':
          aValue = a.deckName;
          bValue = b.deckName;
          break;
        case 'cardsStudied':
          aValue = a.cardsStudied;
          bValue = b.cardsStudied;
          break;
        case 'timeSpentSeconds':
          aValue = a.timeSpentSeconds;
          bValue = b.timeSpentSeconds;
          break;
        case 'accuracy':
          aValue = a.cardsCorrect / (a.cardsStudied || 1);
          bValue = b.cardsCorrect / (b.cardsStudied || 1);
          break;
        default: // startedAt
          aValue = new Date(a.startedAt).getTime();
          bValue = new Date(b.startedAt).getTime();
      }
      
      return sortDirection === 'ascending' 
        ? (aValue > bValue ? 1 : -1)
        : (aValue < bValue ? 1 : -1);
    });
    
    return filteredSessions;
  };

  const handleSort = (clickedColumn: string) => {
    if (sortField !== clickedColumn) {
      setSortField(clickedColumn);
      setSortDirection('ascending');
    } else {
      setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
    }
  };

  const filteredSessions = getFilteredSessions();
  
  return (
    <Container>
      <Header as="h1" dividing>
        <Icon name="history" />
        <Header.Content>
          Study History
          <Header.Subheader>Track your learning progress</Header.Subheader>
        </Header.Content>
      </Header>
      
      {loading ? (
        <Loader active>Loading study history...</Loader>
      ) : error ? (
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>{error}</p>
        </Message>
      ) : sessions.length === 0 ? (
        <Message info>
          <Message.Header>No Study Sessions Yet</Message.Header>
          <p>You haven't completed any study sessions yet. Start studying to track your progress!</p>
        </Message>
      ) : (
        <>
          <Grid columns={2}>
            <Grid.Column>
              <Segment>
                <Header as="h3">Study Statistics</Header>
                <p><strong>Total Sessions:</strong> {sessions.length}</p>
                <p><strong>Total Cards Studied:</strong> {sessions.reduce((sum, session) => sum + session.cardsStudied, 0)}</p>
                <p><strong>Average Accuracy:</strong> {(sessions.reduce((sum, session) => sum + session.cardsCorrect, 0) / sessions.reduce((sum, session) => sum + session.cardsStudied, 0) * 100).toFixed(1)}%</p>
              </Segment>
            </Grid.Column>
            <Grid.Column>
              <Menu secondary>
                <Menu.Item header>Filter:</Menu.Item>
                <Menu.Item 
                  name="All Time" 
                  active={filter === 'all'} 
                  onClick={() => setFilter('all')}
                />
                <Menu.Item 
                  name="Past Week" 
                  active={filter === 'week'} 
                  onClick={() => setFilter('week')}
                />
                <Menu.Item 
                  name="Past Month" 
                  active={filter === 'month'} 
                  onClick={() => setFilter('month')}
                />
              </Menu>
            </Grid.Column>
          </Grid>
          
          <Table sortable celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell 
                  sorted={sortField === 'startedAt' ? sortDirection : undefined}
                  onClick={() => handleSort('startedAt')}
                >
                  Date & Time
                </Table.HeaderCell>
                <Table.HeaderCell 
                  sorted={sortField === 'deckName' ? sortDirection : undefined}
                  onClick={() => handleSort('deckName')}
                >
                  Deck
                </Table.HeaderCell>
                <Table.HeaderCell 
                  sorted={sortField === 'cardsStudied' ? sortDirection : undefined}
                  onClick={() => handleSort('cardsStudied')}
                >
                  Cards
                </Table.HeaderCell>
                <Table.HeaderCell 
                  sorted={sortField === 'accuracy' ? sortDirection : undefined}
                  onClick={() => handleSort('accuracy')}
                >
                  Accuracy
                </Table.HeaderCell>
                <Table.HeaderCell 
                  sorted={sortField === 'timeSpentSeconds' ? sortDirection : undefined}
                  onClick={() => handleSort('timeSpentSeconds')}
                >
                  Time Spent
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            
            <Table.Body>
              {filteredSessions.map((session) => (
                <Table.Row key={session.id}>
                  <Table.Cell>
                    {formatDate(session.startedAt)}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/decks/${session.deckId}`}>
                      {session.deckName}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{session.cardsStudied}</Table.Cell>
                  <Table.Cell>
                    {Math.round((session.cardsCorrect / session.cardsStudied) * 100)}%
                  </Table.Cell>
                  <Table.Cell>
                    {Math.floor(session.timeSpentSeconds / 60)}m {session.timeSpentSeconds % 60}s
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      )}
    </Container>
  );
};

export default StudyHistory;