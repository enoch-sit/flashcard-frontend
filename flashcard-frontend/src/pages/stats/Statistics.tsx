import React, { useState, useEffect } from 'react';
import { Container, Header, Segment, Grid, Menu, Loader, Message, Statistic, Icon, Divider } from 'semantic-ui-react';
import httpClient from '../../api/http';
import { formatDate } from '../../utils/dateUtils';

interface StatsData {
  totalDecks: number;
  totalCards: number;
  totalStudySessions: number;
  totalTimeSpentMinutes: number;
  totalCardsStudied: number;
  currentStreak: number;
  longestStreak: number;
  averageAccuracy: number;
  studyByDay: { [key: string]: number };
  cardsReviewedByDay: { [key: string]: number };
  accuracyByDay: { [key: string]: number };
  deckPerformance: Array<{
    deckId: string;
    deckName: string;
    cardsStudied: number;
    accuracy: number;
    timeSpentMinutes: number;
  }>;
}

const Statistics: React.FC = () => {
  const [activeView, setActiveView] = useState('overview');
  const [timeFrame, setTimeFrame] = useState('month');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true);
        const response = await httpClient.get(`/stats?timeFrame=${timeFrame}`);
        setStats(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to load statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [timeFrame]);

  // Generate placeholder data for visualization (in a real app, this would come from the API)
  const generateChartData = () => {
    if (!stats) return null;

    // For overview charts
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return formatDate(date.toISOString()).split(' ')[0];
    });

    const studyActivity = last7Days.map(day => ({
      date: day,
      cardsStudied: stats.cardsReviewedByDay[day] || 0,
      accuracy: (stats.accuracyByDay[day] || 0) * 100
    }));

    return { studyActivity };
  };

  const chartData = generateChartData();

  const renderOverview = () => (
    <Grid stackable columns={2}>
      <Grid.Row>
        <Grid.Column width={16}>
          <Segment>
            <Header as="h3">Study Summary</Header>
            <Statistic.Group widths={4} size="small">
              <Statistic>
                <Statistic.Value>{stats?.totalDecks || 0}</Statistic.Value>
                <Statistic.Label>Total Decks</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{stats?.totalCards || 0}</Statistic.Value>
                <Statistic.Label>Total Cards</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{stats?.totalStudySessions || 0}</Statistic.Value>
                <Statistic.Label>Study Sessions</Statistic.Label>
              </Statistic>
              <Statistic>
                <Statistic.Value>{stats?.totalCardsStudied || 0}</Statistic.Value>
                <Statistic.Label>Cards Reviewed</Statistic.Label>
              </Statistic>
            </Statistic.Group>
          </Segment>
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>
          <Segment>
            <Header as="h3">Study Habits</Header>
            <Statistic.Group widths={2} size="small">
              <Statistic color="green">
                <Statistic.Value>
                  <Icon name="fire" /> {stats?.currentStreak || 0}
                </Statistic.Value>
                <Statistic.Label>Current Streak</Statistic.Label>
              </Statistic>
              <Statistic color="orange">
                <Statistic.Value>
                  <Icon name="trophy" /> {stats?.longestStreak || 0}
                </Statistic.Value>
                <Statistic.Label>Longest Streak</Statistic.Label>
              </Statistic>
            </Statistic.Group>
            <Divider />
            <p>
              <strong>Total Study Time:</strong> {stats?.totalTimeSpentMinutes || 0} minutes
            </p>
            <p>
              <strong>Average Accuracy:</strong> {stats?.averageAccuracy ? (stats.averageAccuracy * 100).toFixed(1) : 0}%
            </p>
          </Segment>
        </Grid.Column>

        <Grid.Column>
          <Segment>
            <Header as="h3">Study Activity (Last 7 Days)</Header>
            <p>Charts would be displayed here in a full implementation</p>
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {chartData?.studyActivity.map((day, index) => (
                <div 
                  key={day.date} 
                  style={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '0 10px'
                  }}
                >
                  <div 
                    style={{ 
                      height: `${Math.min(day.cardsStudied * 10, 150)}px`, 
                      width: '30px', 
                      backgroundColor: '#2185d0',
                      marginBottom: '5px'
                    }}
                  />
                  <div>{day.date.split(' ')[0]}</div>
                </div>
              ))}
            </div>
          </Segment>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );

  const renderDeckPerformance = () => (
    <Segment>
      <Header as="h3">Deck Performance</Header>
      {stats?.deckPerformance && stats.deckPerformance.length > 0 ? (
        <div>
          {stats.deckPerformance.map(deck => (
            <Segment key={deck.deckId}>
              <Header as="h4">{deck.deckName}</Header>
              <Grid columns={3} divided>
                <Grid.Row>
                  <Grid.Column textAlign="center">
                    <p><strong>Cards Studied</strong></p>
                    <p>{deck.cardsStudied}</p>
                  </Grid.Column>
                  <Grid.Column textAlign="center">
                    <p><strong>Accuracy</strong></p>
                    <p>{(deck.accuracy * 100).toFixed(1)}%</p>
                  </Grid.Column>
                  <Grid.Column textAlign="center">
                    <p><strong>Time Spent</strong></p>
                    <p>{deck.timeSpentMinutes} min</p>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
          ))}
        </div>
      ) : (
        <Message info>
          <p>No study data available for your decks yet.</p>
        </Message>
      )}
    </Segment>
  );

  if (loading) {
    return (
      <Container>
        <Loader active>Loading statistics...</Loader>
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
      </Container>
    );
  }

  return (
    <Container>
      <Header as="h1" dividing>
        <Icon name="chart bar" />
        <Header.Content>
          Statistics
          <Header.Subheader>Track your learning progress and performance</Header.Subheader>
        </Header.Content>
      </Header>

      <Menu pointing secondary>
        <Menu.Item
          name="Overview"
          active={activeView === 'overview'}
          onClick={() => setActiveView('overview')}
        />
        <Menu.Item
          name="Deck Performance"
          active={activeView === 'deckPerformance'}
          onClick={() => setActiveView('deckPerformance')}
        />
        
        <Menu.Menu position="right">
          <Menu.Item header>Time Period:</Menu.Item>
          <Menu.Item
            name="Week"
            active={timeFrame === 'week'}
            onClick={() => setTimeFrame('week')}
          />
          <Menu.Item
            name="Month"
            active={timeFrame === 'month'}
            onClick={() => setTimeFrame('month')}
          />
          <Menu.Item
            name="All Time"
            active={timeFrame === 'all'}
            onClick={() => setTimeFrame('all')}
          />
        </Menu.Menu>
      </Menu>

      {activeView === 'overview' ? renderOverview() : renderDeckPerformance()}
    </Container>
  );
};

export default Statistics;