const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const projectsApi = {
  /**
   * Listagem de projetos (RLS transparente via Backend NestJS).
   */
  async list(filters?: { status?: string; search?: string }) {
    const url = new URL(`${API_URL}/projects`);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Não foi possível carregar os projetos');
    return await response.json();
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/projects/${id}`);
    if (!response.ok) throw new Error('Projeto não encontrado');
    return await response.json();
  },

  /**
   * Criação transacional de projeto (Cliente + Projeto + 4 Itens Checklist).
   */
  async create(payload: any) {
    const response = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error('Erro ao criar projeto');
    return await response.json();
  },

  /**
   * Upload de arquivo via Signed URL.
   */
  async getUploadUrl(projectId: string, itemId: string, fileName: string) {
    const response = await fetch(`${API_URL}/projects/${projectId}/checklist/${itemId}/upload-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName }),
    });
    if (!response.ok) throw new Error('Erro ao obter URL de upload');
    return await response.json();
  },

  async updateChecklistItemStatus(itemId: string, status: string, rejectionReason?: string) {
    const response = await fetch(`${API_URL}/checklist/${itemId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, rejectionReason }),
    });
    if (!response.ok) throw new Error('Erro ao atualizar status do checklist');
    return await response.json();
  },

  /**
   * Listar projetos que foram recebidos de uma integradora (Visão Engenheiro).
   */
  async listReceived(filters?: { status?: string; search?: string }) {
    const url = new URL(`${API_URL}/projects/received`);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Não foi possível carregar os projetos recebidos');
    return await response.json();
  },

  /**
   * Estatísticas do dashboard de engenharia.
   */
  async getStats() {
    const response = await fetch(`${API_URL}/projects/stats`);
    if (!response.ok) throw new Error('Não foi possível carregar as estatísticas');
    return await response.json();
  },

  /**
   * Delegar um projeto para uma empresa de engenharia.
   */
  async delegate(projectId: string, engineeringTenantId: string) {
    const response = await fetch(`${API_URL}/projects/${projectId}/delegate`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ delegatedTenantId: engineeringTenantId }),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Erro ao delegar projeto');
    }
    return await response.json();
  }
};

