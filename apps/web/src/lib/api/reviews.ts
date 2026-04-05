const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const reviewsApi = {
  /**
   * Listar todas as avaliações da engenharia.
   */
  async list() {
    const response = await fetch(`${API_URL}/reviews`);
    if (!response.ok) throw new Error('Não foi possível carregar as avaliações');
    return await response.json();
  },

  /**
   * Obter média de avaliações.
   */
  async getAverage() {
    const response = await fetch(`${API_URL}/reviews/average`);
    if (!response.ok) throw new Error('Não foi possível carregar a média');
    return await response.json();
  },

  /**
   * Responder a uma avaliação.
   */
  async respond(reviewId: string, response: string) {
    const res = await fetch(`${API_URL}/reviews/${reviewId}/respond`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ response })
    });
    if (!res.ok) throw new Error('Erro ao responder avaliação');
    return await res.json();
  }
};
