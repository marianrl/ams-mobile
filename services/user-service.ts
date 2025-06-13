import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../config/api';
import { User } from '../types/user';
import { UserMailRequest } from '../types/user_mail_request';
import { UserRequest } from '../types/user_request';

export interface ApiResponse {
  status: number;
  data: User[];
  name: string;
  lastName: string;
}

const API_BASE_URL = 'https://ams-backend-0it4.onrender.com/api/v1';

const userService = {
  async fetchAllUser(endpoint: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/${endpoint}`);
      return {
        data: response.data,
        status: response.status,
        name: response.data.name,
        lastName: response.data.lastName,
      };
    } catch (error) {
      throw new Error('Error al obtener los datos de los Usuarios');
    }
  },

  async fetchUserByMailAndPassword(
    endpoint: string,
    userRequest: UserRequest
  ): Promise<number> {
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}/${endpoint}`,
        userRequest
      );

      // Almacenar el token en AsyncStorage
      const token = response.data.token;
      if (token) {
        await AsyncStorage.setItem('authToken', `Bearer ${token}`);
        console.log('Token stored:', token);
        return response.status;
      }
      return 401;
    } catch (error: any) {
      if (error.response) {
        return error.response.status;
      }
      return 500;
    }
  },

  async userExists(endpoint: string, mail: UserMailRequest): Promise<boolean> {
    try {
      const response = await apiClient.post(endpoint, mail);

      return response.data;
    } catch (error) {
      throw new Error('Error al buscar el Usuarios');
    }
  },

  async createUser(endpoint: string, user: User): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}/${endpoint}`,
        user
      );
      return {
        data: response.data,
        status: response.status,
        name: response.data.name,
        lastName: response.data.lastName,
      };
    } catch (error) {
      throw new Error('Error al crear los Usuarios');
    }
  },

  async updateUser(
    endpoint: string,
    id: number,
    user: User
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.put(
        `${API_BASE_URL}/${endpoint}/${id}`,
        user
      );
      return {
        data: response.data,
        status: response.status,
        name: response.data.name,
        lastName: response.data.lastName,
      };
    } catch (error) {
      throw new Error('Error al actualizar los datos de los Usuarios');
    }
  },

  async deleteUser(endpoint: string, id: number): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete(
        `${API_BASE_URL}/${endpoint}/${id}`
      );
      return {
        data: response.data,
        status: response.status,
        name: response.data.name,
        lastName: response.data.lastName,
      };
    } catch (error) {
      throw new Error('Error al eliminar los Usuarios');
    }
  },
};

export { userService };
