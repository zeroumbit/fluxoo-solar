import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const projectsApi = {
  /**
   * Listagem de projetos (RLS transparente via Backend NestJS).
   */
  async list(filters?: { status?: string; search?: string }) {
    const { data } = await axios.get(`${API_URL}/projects`, { params: filters });
    return data;
  },

  async getById(id: string) {
    const { data } = await axios.get(`${API_URL}/projects/${id}`);
    return data;
  },

  /**
   * Criação transacional de projeto (Cliente + Projeto + 4 Itens Checklist).
   */
  async create(payload: any) {
    const { data } = await axios.post(`${API_URL}/projects`, payload);
    return data;
  },

  /**
   * Upload de arquivo via Signed URL.
   */
  async getUploadUrl(projectId: string, itemId: string, fileName: string) {
    const { data } = await axios.post(`${API_URL}/projects/${projectId}/checklist/${itemId}/upload-url`, { fileName });
    return data;
  },

  async updateChecklistItemStatus(itemId: string, status: string, rejectionReason?: string) {
    const { data } = await axios.patch(`${API_URL}/checklist/${itemId}/status`, { status, rejectionReason });
    return data;
  }
};
