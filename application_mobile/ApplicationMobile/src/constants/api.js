import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your backend base URL
export const BASE_URL = 'http://192.168.100.140:8082';
// Create the Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// -----------------------------------------------------------------
// 1. REQUEST INTERCEPTOR
// Automatically attaches the user's JWT token to every request
// -----------------------------------------------------------------
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Failed to load auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// -----------------------------------------------------------------
// 2. RESPONSE INTERCEPTOR
// Handles 401 Unauthorized errors globally, logs the user out
// -----------------------------------------------------------------
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If we get a 401 (Unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 1. Clear the user's token
      await AsyncStorage.multiRemove(['token', 'username', 'role']);

      // 2. You can optionally trigger a global navigation reset here
      // console.log("Session expired. Redirecting to login...");
      
      // ⚠️ Note for Expo: If you want to reset the navigation stack automatically
      // you will need to import your RootNavigationRef here and navigate back to Login.
    }

    return Promise.reject(error);
  }
);

// -----------------------------------------------------------------
// 3. HELPER FUNCTIONS
// Use these in your LoginScreen.jsx to save the token after logging in
// -----------------------------------------------------------------
export const setAuthToken = async (token) => {
  if (token) {
    await AsyncStorage.setItem('token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    await AsyncStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const getAuthToken = async () => {
  return await AsyncStorage.getItem('token');
};

export const removeAuthToken = async () => {
  await AsyncStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};



export default api;