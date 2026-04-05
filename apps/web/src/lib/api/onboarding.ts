const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const onboardingApi = {
  /**
   * Envia os dados de onboarding para o backend (NestJS).
   * O backend processa a criação transacional no Supabase via Service Role Key.
   */
  async register(data: any) {
    try {
      const response = await fetch(`${API_URL}/onboarding/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const message = errorData?.message || 'Erro inesperado no servidor.';
        throw new Error(Array.isArray(message) ? message[0] : message);
      }

      return await response.json();
    } catch (error: any) {
      throw error;
    }
  },

  /**
   * Consulta CNPJ via Brasil API (ou similar) no frontend.
   */
  async getCnpjData(cnpj: string) {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
    if (!response.ok) throw new Error('Não foi possível carregar os dados do CNPJ');
    return await response.json();
  },

  /**
   * Consulta CEP via ViaCEP no frontend.
   */
  async getCepData(cep: string) {
    const cleanCep = cep.replace(/\D/g, '');
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    if (!response.ok) throw new Error('CEP não encontrado');
    return await response.json();
  }
};
