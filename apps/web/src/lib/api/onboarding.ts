import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const onboardingApi = {
  /**
   * Envia os dados de onboarding para o backend (NestJS).
   * O backend processa a criação transacional no Supabase via Service Role Key.
   */
  async register(data: any) {
    try {
      const response = await axios.post(`${API_URL}/onboarding/register`, data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro inesperado no servidor.';
      throw new Error(Array.isArray(message) ? message[0] : message);
    }
  },

  /**
   * Consulta CNPJ via Brasil API (ou similar) no frontend.
   */
  async getCnpjData(cnpj: string) {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    const { data } = await axios.get(`https://brasilapi.com.br/api/cnpj/v1/${cleanCnpj}`);
    return data;
  },

  /**
   * Consulta CEP via ViaCEP no frontend.
   */
  async getCepData(cep: string) {
    const cleanCep = cep.replace(/\D/g, '');
    const { data } = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
    return data;
  }
};
