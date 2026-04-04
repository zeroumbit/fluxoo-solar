import { createHash } from 'crypto';

/**
 * Faz o hash dos dados sensíveis (CPF, CNPJ, E-mail) para comparação segura
 * sem armazenar o texto plano no bando de dados em campos de busca.
 */
export function hashData(data: string): string {
  if (!data) return '';
  return createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}
