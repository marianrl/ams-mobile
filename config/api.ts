import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

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
      if (status === 401) {
        // Eliminar token si existe
        await AsyncStorage.removeItem('authToken');
      } else if (status === 403) {
        // Manejar errores de JWT
        if (error.response.data?.message?.includes('JWT')) {
          console.error('Token inválido, redirigiendo al login...');
          await AsyncStorage.removeItem('authToken');
          // Necesitarás implementar la navegación a la pantalla de login
          // navigation.navigate('Login');
        } else {
          console.error('Acceso denegado:', error.response.data);
        }
      }
    } else {
      console.error('Error de red o configuración:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
