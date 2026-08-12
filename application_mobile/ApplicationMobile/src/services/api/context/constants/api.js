import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Smart IP selection
let BASE_URL = 'http://192.168.100.200:8082'; // Default for physical device

if (Platform.OS === 'android') {
  // Android Emulator uses 10.0.2.2
  BASE_URL = 'http://10.0.2.2:8082';
} else if (Platform.OS === 'ios') {
  // iOS Simulator uses localhost
  BASE_URL = 'http://localhost:8082';
}

// Create the Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, 
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) { console.warn('Failed to load auth token:', error); }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// Helper Functions
export const setAuthToken = async (token) => {
  if (token) {
    await AsyncStorage.setItem('userToken', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    await AsyncStorage.removeItem('userToken');
    delete api.defaults.headers.common['Authorization'];
  }
};

export const removeAuthToken = async () => {
  await AsyncStorage.removeItem('userToken');
  delete api.defaults.headers.common['Authorization'];
};

export { BASE_URL }; // Export it so you can see which IP is being used
export default api;