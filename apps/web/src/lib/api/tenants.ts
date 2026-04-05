const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const tenantsApi = {
  /**
   * Listar parceiros de engenharia (Empresas de Engenharia).
   */
  async listEngineeringFirms(filters?: { search?: string; specialty?: string }) {
    // Nota: O backend deve retornar apenas tenants do tipo ENGINEERING_FIRM
    const url = new URL(`${API_URL}/tenants/engineering`);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Erro ao listar empresas de engenharia');
    return await response.json();
  },

  async getById(id: string) {
    const response = await fetch(`${API_URL}/tenants/${id}`);
    if (!response.ok) throw new Error('Empresa não encontrada');
    return await response.json();
  }
};
