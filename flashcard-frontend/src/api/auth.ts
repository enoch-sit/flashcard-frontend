import httpClient from './http';
import { 
  AuthTokens, 
  LoginRequest, 
  RegisterRequest, 
  VerifyEmailRequest, 
  ResetPasswordRequest,
  RequestPasswordResetRequest
} from '../types/auth';

export const signup = async (data: RegisterRequest) => {
  const response = await httpClient.post('/auth/signup', data);
  return response.data;
};

export const verifyEmail = async (data: VerifyEmailRequest) => {
  const response = await httpClient.post('/auth/verify-email', data);
  return response.data;
};

export const login = async (data: LoginRequest): Promise<AuthTokens> => {
  const response = await httpClient.post('/auth/login', data);
  
  // Store tokens
  localStorage.setItem('accessToken', response.data.accessToken);
  localStorage.setItem('refreshToken', response.data.refreshToken);
  
  return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<AuthTokens> => {
  const response = await httpClient.post('/auth/refresh', { refreshToken });
  return response.data;
};

export const logout = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (refreshToken) {
    try {
      await httpClient.post('/auth/logout', { refreshToken });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
  
  // Clear tokens
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

export const requestPasswordReset = async (data: RequestPasswordResetRequest) => {
  const response = await httpClient.post('/auth/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest) => {
  const response = await httpClient.post('/auth/reset-password', data);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await httpClient.get('/auth/profile');
  return response.data;
};