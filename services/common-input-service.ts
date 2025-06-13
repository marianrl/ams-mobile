import apiClient from '../config/api';

export interface ApiResponse {
  data: any;
  status: number;
}

const commonInputService = {
  async fetchCommonInputsByAuditId(
    endpoint: string,
    id: string
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.get(`${endpoint}/${id}`);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      throw new Error('Error al obtener las Auditorias por ID');
    }
  },
};

export { commonInputService };
