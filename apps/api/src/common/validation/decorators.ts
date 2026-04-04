import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';
import { isValidCPF, isValidCNPJ } from './br-documents';

/**
 * Decorator para CPF (Regra 5).
 */
export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsCPF',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return isValidCPF(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CPF válido (Regra 5)`;
        },
      },
    });
  };
}

/**
 * Decorator para CNPJ (Regra 5).
 */
export function IsCNPJ(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsCNPJ',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          return isValidCNPJ(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ser um CNPJ válido (Regra 5)`;
        },
      },
    });
  };
}

/**
 * Decorator para Telefone BR (Regra 4).
 */
export function IsBrazilPhone(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsBrazilPhone',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const digits = value.replace(/\D/g, '');
          return digits.length >= 10 && digits.length <= 11;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} deve ter entre 10 e 11 dígitos numéricos (Regra 4)`;
        },
      },
    });
  };
}
