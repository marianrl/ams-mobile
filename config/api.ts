import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';

// Reemplazar con la URL real del backend
const API_BASE_URL = 'https://ams-backend-0it4.onrender.com/api/v1';

// Crear instancia de Axios con configuración inicial
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Configurar interceptor de solicitud para incluir el token
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

// Configurar interceptor de respuesta para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401 || status === 403) {
        // Eliminar token si existe
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userData');

        // Redirigir al login
        try {
          router.replace('/login');
        } catch (navigationError) {
          console.error('Navigation error:', navigationError);
        }
      }
    } else {
      console.error('Error de red o configuración:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
