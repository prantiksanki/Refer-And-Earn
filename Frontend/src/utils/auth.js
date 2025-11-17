import Cookies from 'js-cookie';

// Get token from cookie
export const getToken = () => {
  // Prefer cookie (if set by server), otherwise fall back to localStorage
  return Cookies.get('token') || localStorage.getItem('token');
};

// Set token in cookie
export const setToken = (token, options = {}) => {
  // default to 7 days expiry unless overridden
  const opts = { expires: 7, ...options };
  try {
    Cookies.set('token', token, opts);
  } catch (e) {
    // If cookies can't be set (e.g., cross-domain), keep token in localStorage
    console.warn('Could not set cookie for token, falling back to localStorage', e);
  }
  try {
    localStorage.setItem('token', token);
  } catch (e) {
    console.warn('Could not set token in localStorage', e);
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};

// Get user email from localStorage or return null
export const getUserEmail = () => {
  return localStorage.getItem('userEmail');
};

// Set user email in localStorage
export const setUserEmail = (email) => {
  localStorage.setItem('userEmail', email);
};

// Clear authentication (remove token and user data)
export const clearAuth = () => {
  // Server will clear the httpOnly cookie
  try { Cookies.remove('token'); } catch (e) {}
  try { localStorage.removeItem('token'); } catch (e) {}
  localStorage.removeItem('userEmail');
};

// Fetch with auth - automatically includes token in headers
export const authenticatedFetch = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include' // Important for cookies to be sent/received
  });

  return response;
};
