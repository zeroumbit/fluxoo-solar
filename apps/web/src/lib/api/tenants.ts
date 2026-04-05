import { createClient } from '@/lib/supabase/client';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function authFetch(url: string, options: RequestInit = {}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(session ? { 'Authorization': `Bearer ${session.access_token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

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
    const response = await authFetch(url.toString());
    if (!response.ok) throw new Error('Erro ao listar empresas de engenharia');
    return await response.json();
  },

  async getById(id: string) {
    const response = await authFetch(`${API_URL}/tenants/${id}`);
    if (!response.ok) throw new Error('Empresa não encontrada');
    return await response.json();
  }
};
