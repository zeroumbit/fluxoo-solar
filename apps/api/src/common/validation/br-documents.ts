/**
 * Validação de CPF (Regra 5).
 */
export function isValidCPF(cpf: string): boolean {
  const v = cpf.replace(/\D/g, '');
  if (v.length !== 11) return false;
  if (/^(\d)\1+$/.test(v)) return false;

  let sum = 0;
  let rest;

  for (let i = 1; i <= 9; i++) sum = sum + parseInt(v.substring(i - 1, i)) * (11 - i);
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(v.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) sum = sum + parseInt(v.substring(i - 1, i)) * (12 - i);
  rest = (sum * 10) % 11;

  if (rest === 10 || rest === 11) rest = 0;
  if (rest !== parseInt(v.substring(10, 11))) return false;

  return true;
}

/**
 * Validação de CNPJ (Regra 5).
 */
export function isValidCNPJ(cnpj: string): boolean {
  const v = cnpj.replace(/\D/g, '');
  if (v.length !== 14) return false;
  if (/^(\d)\1+$/.test(v)) return false;

  let size = v.length - 2;
  let numbers = v.substring(0, size);
  const digits = v.substring(size);
  let sum = 0;
  let pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  size = size + 1;
  numbers = v.substring(0, size);
  sum = 0;
  pos = size - 7;

  for (let i = size; i >= 1; i--) {
    sum += parseInt(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}
