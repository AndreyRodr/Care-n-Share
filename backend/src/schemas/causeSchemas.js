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

export const causeIdParamSchema = z.object({
  causeId: z.string().uuid('ID da causa inválido.')
});

export const postCauseParamsSchema = z.object({
  postId: z.string().uuid('ID da publicação inválido.')
});

export const postCauseDeleteParamsSchema = z.object({
  postId: z.string().uuid('ID da publicação inválido.'),
  causeId: z.string().uuid('ID da causa inválido.')
});

export const causesSchema = z.object({
  causeIds: z
    .array(
      z.string().uuid('Um dos IDs de causa é inválido.')
    )
    .min(1, 'Informe pelo menos uma causa.')
    .max(50, 'Você pode selecionar no máximo 50 causas.')
}).strict();

export const singleCauseSchema = z.object({
  causeId: z.string().uuid('ID da causa inválido.')
}).strict();
