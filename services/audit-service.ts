import apiClient from '../config/api';
import { Audit } from '../types/audit';

export interface ApiResponse {
  data: any;
  status: number;
  auditId?: number;
}

const API_BASE_URL = 'https://ams-backend-0it4.onrender.com/api/v1';

const auditService = {
  async fetchAllAudit(endpoint: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/${endpoint}`);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `Error al obtener las Auditorias: ${
            error.response.data.message || error.message
          }`
        );
      }
      throw new Error('Error al obtener las Auditorias');
    }
  },
  async createAudit(
    endpoint: string,
    auditInput: number
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(
        `${API_BASE_URL}/${endpoint}`,
        auditInput,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const auditId = response.data.id;
      return {
        data: response.data,
        status: response.status,
        auditId: auditId,
      };
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `Error al crear nuevas auditorías: ${
            error.response.data.message || error.message
          }`
        );
      }
      throw new Error('Error al crear nuevas auditorías');
    }
  },
  async updateAudit(
    endpoint: string,
    id: string,
    audit: Audit
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.put(
        `${API_BASE_URL}/${endpoint}/${id}`,
        audit,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `Error al actualizar las auditorias: ${
            error.response.data.message || error.message
          }`
        );
      }
      throw new Error('Error al actualizar las auditorias');
    }
  },
  async deleteAudit(endpoint: string, id: number): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete(
        `${API_BASE_URL}/${endpoint}/${id}`
      );
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      if (error.response) {
        throw new Error(
          `Error al eliminar las auditorias: ${
            error.response.data.message || error.message
          }`
        );
      }
      throw new Error('Error al eliminar las auditorias');
    }
  },
};

export { auditService };
