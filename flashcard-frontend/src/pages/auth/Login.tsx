import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Header, Segment, Message, Grid, Image } from 'semantic-ui-react';
import LoginForm from '../../components/auth/LoginForm';
import { useAuth } from '../../hooks/useAuth';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  return (
    <Container>
      <Grid centered columns={2} stackable>
        <Grid.Column>
          <Header as="h2" color="teal" textAlign="center">
            <Image src="/logo.png" /> Log in to your account
          </Header>
          
          {error && (
            <Message negative>
              <Message.Header>Login Failed</Message.Header>
              <p>{error}</p>
            </Message>
          )}
          
          <Segment stacked>
            <LoginForm onError={(message) => setError(message)} />
          </Segment>
          
          <Message>
            New to us? <Link to="/register">Sign Up</Link> | <Link to="/forgot-password">Forgot Password?</Link>
          </Message>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Login;