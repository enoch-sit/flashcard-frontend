import React, { useState } from 'react';
import { Container, Header, Form, Button, Message, Segment, Grid, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../../api/auth';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    
    try {
      await requestPasswordReset({ email });
      setSuccessMessage('Password reset instructions have been sent to your email address.');
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Grid centered columns={2} stackable>
        <Grid.Column>
          <Header as="h2" color="teal" textAlign="center">
            <Image src="/logo.png" /> Forgot Password
          </Header>
          
          {successMessage ? (
            <Message positive>
              <Message.Header>Email Sent</Message.Header>
              <p>{successMessage}</p>
              <p>Please check your email for instructions on how to reset your password.</p>
              <Link to="/login">Back to Login</Link>
            </Message>
          ) : (
            <Segment stacked>
              <p>Enter your email address and we'll send you instructions to reset your password.</p>
              
              {error && (
                <Message negative>
                  <p>{error}</p>
                </Message>
              )}
              
              <Form onSubmit={handleSubmit} loading={loading}>
                <Form.Field>
                  <label>Email Address</label>
                  <Form.Input
                    fluid
                    icon="mail"
                    iconPosition="left"
                    placeholder="Email address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Field>
                
                <Button fluid size="large" primary type="submit">
                  Request Password Reset
                </Button>
              </Form>
            </Segment>
          )}
          
          <Message>
            <Link to="/login">Back to Login</Link>
          </Message>
        </Grid.Column>
      </Grid>
    </Container>
  );
};

export default ForgotPassword;