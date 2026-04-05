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

export const financeApi = {
  /**
   * Resumo financeiro para engenharia.
   */
  async getEngineeringSummary() {
    const response = await authFetch(`${API_URL}/finance/engineering`);
    if (!response.ok) throw new Error('Não foi possível carregar o resumo financeiro');
    return await response.json();
  },

  /**
   * Dados financeiros detalhados para dashboard de engenharia.
   */
  async getEngineeringStats() {
    const response = await authFetch(`${API_URL}/finance/engineering-stats`);
    if (!response.ok) throw new Error('Não foi possível carregar as estatísticas financeiras');
    return await response.json();
  }
};
