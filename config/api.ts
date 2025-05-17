import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Replace with your actual backend URL
const API_BASE_URL = 'http://10.0.2.2:8080/api/v1';

// Create Axios instance with initial configuration
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Configure request interceptor to include token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = token;
      }
      return config;
    } catch (error) {
      return Promise.reject(error);
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configure response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        // Remove token if it exists
        await AsyncStorage.removeItem('authToken');
      } else if (status === 403) {
        // Handle JWT errors
        if (error.response.data?.message?.includes('JWT')) {
          console.error('Invalid token, redirecting to login...');
          await AsyncStorage.removeItem('authToken');
          // You'll need to implement navigation to login screen
          // navigation.navigate('Login');
        } else {
          console.error('Access denied:', error.response.data);
        }
      }
    } else {
      console.error('Network or configuration error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
