/**
 * Validates an email address
 * @param email Email address to validate
 * @returns Boolean indicating if the email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password
 * @param password Password to validate
 * @returns Object with validation result and error message
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  
  return { valid: true };
};

/**
 * Validates if two password fields match
 * @param password Main password
 * @param confirmPassword Password confirmation
 * @returns Boolean indicating if passwords match
 */
export const doPasswordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Check if a field is empty
 * @param value Field value to check
 * @returns Boolean indicating if the field is empty
 */
export const isEmpty = (value: string): boolean => {
  return value.trim() === '';
};

/**
 * Validates a username
 * @param username Username to validate
 * @returns Boolean indicating if the username is valid
 */
export const isValidUsername = (username: string): boolean => {
  // Username must be 3-20 characters and contain only alphanumeric chars and underscores
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};