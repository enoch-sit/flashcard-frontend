import React, { useState, useEffect } from 'react';
import { Container, Header, Form, Button, Message, Segment, Grid, Image } from 'semantic-ui-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../../api/auth';

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [token, setToken] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    // Extract token from query parameters
    const query = new URLSearchParams(location.search);
    const tokenParam = query.get('token');
    
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!token) {
      setError('Invalid or missing reset token');
      return;
    }
    
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      await resetPassword({ token, newPassword });
      setSuccess(true);
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
            <Image src="/logo.png" /> Reset Your Password
          </Header>
          
          {success ? (
            <Message positive>
              <Message.Header>Password Reset Successful!</Message.Header>
              <p>Your password has been reset successfully.</p>
              <Button as={Link} to="/login" primary>Proceed to Login</Button>
            </Message>
          ) : (
            <Segment stacked>
              {error && (
                <Message negative>
                  <p>{error}</p>
                </Message>
              )}
              
              <Form onSubmit={handleSubmit} loading={loading}>
                <Form.Field>
                  <label>New Password</label>
                  <Form.Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="New password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </Form.Field>
                
                <Form.Field>
                  <label>Confirm Password</label>
                  <Form.Input
                    fluid
                    icon="lock"
                    iconPosition="left"
                    placeholder="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </Form.Field>
                
                <Button fluid size="large" primary type="submit" disabled={!token}>
                  Reset Password
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

export default ResetPassword;