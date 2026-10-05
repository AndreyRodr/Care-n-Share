import { z } from 'zod';

const projectTitleSchema = z
  .string()
  .trim()
  .min(3, 'O título deve ter pelo menos 3 caracteres.')
  .max(150, 'O título deve ter no máximo 150 caracteres.');

const projectDescriptionSchema = z
  .string()
  .trim()
  .min(1, 'A descrição do projeto é obrigatória.')
  .max(5000, 'A descrição deve ter no máximo 5000 caracteres.');

const causeIdsSchema = z
  .array(z.string().uuid('Um identificador de causa é inválido.'))
  .max(20, 'Um projeto pode ter no máximo 20 causas.');

export const createProjectSchema = z
  .object({
    title: projectTitleSchema,
    description: projectDescriptionSchema,
    causeIds: causeIdsSchema.optional().default([])
  })
  .strict();

export const updateProjectSchema = z
  .object({
    title: projectTitleSchema.optional(),
    description: projectDescriptionSchema.optional(),
    causeIds: causeIdsSchema.optional()
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: 'Envie ao menos um campo para atualizar.' }
  );