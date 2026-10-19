import { z } from 'zod';
import { isValidCnpj, onlyDigits } from '../services/CnpjValidationService.js';

const optionalText = z
  .string()
  .trim()
  .max(1000, 'O texto deve ter no máximo 1000 caracteres.')
  .optional()
  .or(z.literal(''))
  .transform((value) => value || undefined);

const optionalCnpj = z
  .string()
  .trim()
  .optional()
  .or(z.literal(''))
  .transform((value) => (value ? onlyDigits(value) : undefined))
  .refine(
    (value) => value === undefined || isValidCnpj(value),
    'Informe um CNPJ válido.'
  );

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'O nome deve ter pelo menos 3 caracteres.')
      .max(120, 'O nome deve ter no máximo 120 caracteres.'),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Informe um e-mail válido.')
      .max(254, 'O e-mail é muito longo.'),

    password: z
      .string()
      .min(8, 'A senha deve ter pelo menos 8 caracteres.')
      .max(24, 'A senha deve ter no máximo 24 caracteres.')
      .regex(/[A-Z]/, 'A senha deve conter ao menos uma letra maiúscula.')
      .regex(/[a-z]/, 'A senha deve conter ao menos uma letra minúscula.')
      .regex(/\d/, 'A senha deve conter ao menos um número.'),

    description: optionalText,

    type: z.enum(['U', 'O'], {
      error: 'O tipo de conta deve ser U (usuário) ou O (ONG).'
    }),

    cnpj: optionalCnpj,

    pixKey: z
      .string()
      .trim()
      .max(140, 'A chave PIX deve ter no máximo 140 caracteres.')
      .optional()
      .or(z.literal(''))
      .transform((value) => value || undefined)
    })
  .strict()
  .superRefine((data, context) => {
    if (data.type === 'O' && !data.cnpj) {
      context.addIssue({
        code: 'custom',
        path: ['cnpj'],
        message: 'O CNPJ é obrigatório para o cadastro de uma ONG.'
      });
    }
  });

export const loginSchema = z
  .object({
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Informe um e-mail válido.')
      .max(254, 'O e-mail é muito longo.'),

    // No login, não aplicamos as regras de complexidade para manter
    // compatibilidade com contas existentes.
    password: z
      .string()
      .min(1, 'A senha é obrigatória.')
      .max(24, 'A senha deve ter no máximo 24 caracteres.')
  })
  .strict();

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'O nome deve ter pelo menos 3 caracteres.')
      .max(120, 'O nome deve ter no máximo 120 caracteres.')
      .optional(),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email('Informe um e-mail válido.')
      .max(254, 'O e-mail é muito longo.')
      .optional(),

    description: optionalText,

    pixKey: z
      .string()
      .trim()
      .max(140, 'A chave PIX deve ter no máximo 140 caracteres.')
      .optional()
      .or(z.literal(''))
      .transform((value) => value || undefined)
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: 'Envie ao menos um campo para atualizar.' }
  );