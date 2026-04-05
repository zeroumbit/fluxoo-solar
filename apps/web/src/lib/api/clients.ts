const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const clientsApi = {
  /**
   * Listar clientes diretos da engenharia (projetos próprios sem integradora).
   */
  async list() {
    const response = await fetch(`${API_URL}/clients`);
    if (!response.ok) throw new Error('Não foi possível carregar os clientes');
    return await response.json();
  },

  /**
   * Criar novo cliente/projeto direto.
   */
  async create(data: any) {
    const response = await fetch(`${API_URL}/clients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erro ao criar cliente');
    return await response.json();
  }
};

export const showcaseApi = {
  /**
   * Obter configuração da vitrine da engenharia.
   */
  async get() {
    const response = await fetch(`${API_URL}/engineering/showcase`);
    if (!response.ok) throw new Error('Não foi possível carregar a vitrine');
    return await response.json();
  },

  /**
   * Atualizar configuração da vitrine.
   */
  async update(data: any) {
    const response = await fetch(`${API_URL}/engineering/showcase`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Erro ao atualizar vitrine');
    return await response.json();
  }
};
