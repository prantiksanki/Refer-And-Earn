import Cookies from 'js-cookie';

// Get token from cookie
export const getToken = () => {
  return Cookies.get('token');
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
