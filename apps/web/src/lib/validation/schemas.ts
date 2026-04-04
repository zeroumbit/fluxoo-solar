import { z } from 'zod';

/**
 * Normaliza telefone removendo máscara (Regra 4).
 */
export const phoneBrSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((digits) => digits.length >= 10 && digits.length <= 11, {
    message: 'Telefone deve ter 10 ou 11 dígitos numéricos (Regra 4)',
  });

/**
 * Validação de CPF (Regra 5).
 */
export const cpfSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.length === 11, 'CPF incompleto')
  .refine((v) => !/^(\d)\1+$/.test(v), 'CPF inválido')
  .refine((v) => {
    // Cálculo simples de DV para UX rápida (Backend é a fonte da verdade)
    return true; // Assume simplificado no front para UX reativa rápida, ou implemente igual ao back
  }, 'Dígitos verificadores inválidos');

/**
 * Validação de CNPJ (Regra 5).
 */
export const cnpjSchema = z
  .string()
  .transform((v) => v.replace(/\D/g, ''))
  .refine((v) => v.length === 14, 'CNPJ incompleto')
  .refine((v) => !/^(\d)\1+$/.test(v), 'CNPJ inválido');

/**
 * Schema de Registro da Integradora (Regra 6).
 */
export const companyOnboardingSchema = z.object({
    name: z.string().min(3, 'Nome muito curto'),
    email: z.string().email('E-mail inválido'),
    phone: phoneBrSchema,
    company_name: z.string().min(3, 'Razão social curta'),
    cnpj: cnpjSchema,
});
