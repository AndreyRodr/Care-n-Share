import { z } from 'zod';

const optionalDescription = z
  .string()
  .trim()
  .max(1000, 'A descrição deve ter no máximo 1000 caracteres.')
  .optional()
  .or(z.literal(''))
  .transform((value) => value || undefined);

const causeNameSchema = z
  .string()
  .trim()
  .min(2, 'O nome da causa deve ter pelo menos 2 caracteres.')
  .max(100, 'O nome da causa deve ter no máximo 100 caracteres.');

export const createCauseSchema = z
  .object({
    name: causeNameSchema,
    description: optionalDescription
  })
  .strict();

export const updateCauseSchema = z
  .object({
    name: causeNameSchema.optional(),
    description: optionalDescription
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: 'Envie ao menos um campo para atualizar.' }
  );