import apiClient from '../config/api';
import { Audit } from '../types/audit';

export interface ApiResponse {
  // Define la estructura de la respuesta de la API si es necesario
  data: any;
  status: number;
  auditId?: number;
}

const API_BASE_URL = 'http://10.0.2.2:8080/api/v1';

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
      // Asegúrate de que la respuesta contiene el ID de la nueva auditoría
      const auditId = response.data.id;
      return {
        data: response.data,
        status: response.status,
        auditId: auditId, // Incluye el ID en el objeto de retorno
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
