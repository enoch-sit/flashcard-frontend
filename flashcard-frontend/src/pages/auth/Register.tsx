import React, { useState } from 'react';
import { Container, Grid, Header, Image, Message, Segment } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '../../components/auth/RegisterForm';
import useAuth from '../../hooks/useAuth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleRegistrationSuccess = () => {
    setSuccessMessage('Registration successful! Please check your email to verify your account.');
    setError(null);
  };

  const handleRegistrationError = (errorMessage: string) => {
    setError(errorMessage);
    setSuccessMessage(null);
  };

  return (
    <Container>
      <Grid centered columns={2} stackable>
        <Grid.Column>
          <Header as="h2" color="teal" textAlign="center">
            <Image src="/logo.png" /> Create a new account
          </Header>
          
          {successMessage && (
            <Message positive>
              <Message.Header>Registration Successful!</Message.Header>
              <p>{successMessage}</p>
            </Message>
          )}
          
          {error && (
            <Message negative>
              <Message.Header>Registration Failed</Message.Header>
              <p>{error}</p>
            </Message>
          )}
          
          {!successMessage && (
            <Segment stacked>
              <RegisterForm 
                onSuccess={handleRegistrationSuccess} 
                onError={handleRegistrationError} 
              />
            </Segment>
          )}
          
          <Message>
            Already have an account? <Link to="/login">Log In</Link>
          </Message>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default Register;