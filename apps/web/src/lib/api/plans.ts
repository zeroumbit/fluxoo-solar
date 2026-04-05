const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const plansApi = {
  async list(targetType?: string) {
    const url = new URL(`${API_URL}/plans`);
    if (targetType) url.searchParams.append('target_type', targetType);
    
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Erro ao carregar planos');
    return await response.json();
  },

  async create(plan: any) {
    const response = await fetch(`${API_URL}/plans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    if (!response.ok) throw new Error('Erro ao criar plano');
    return await response.json();
  },

  async update(id: string, plan: any) {
    const response = await fetch(`${API_URL}/plans/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan),
    });
    if (!response.ok) throw new Error('Erro ao atualizar plano');
    return await response.json();
  },

  async delete(id: string) {
    const response = await fetch(`${API_URL}/plans/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Erro ao excluir plano');
    return await response.json();
  }
};
