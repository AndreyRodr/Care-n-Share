import { z } from 'zod';

export const createPostSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'O título deve ter pelo menos 3 caracteres.')
      .max(150, 'O título deve ter no máximo 150 caracteres.'),

    content: z
      .string()
      .trim()
      .min(1, 'O conteúdo da publicação é obrigatório.')
      .max(5000, 'O conteúdo deve ter no máximo 5000 caracteres.')
  })
  .strict();