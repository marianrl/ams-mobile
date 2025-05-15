import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../config/api';

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  // Add other response fields as needed
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        '/auth/login',
        credentials
      );
      if (response.data.token) {
        await AsyncStorage.setItem('authToken', response.data.token);
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem('authToken');
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
