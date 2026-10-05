import { z } from 'zod';

export const idParamSchema = z
  .object({
    id: z.string().uuid('O identificador informado é inválido.')
  })
  .strict();

export const ongIdParamSchema = z
  .object({
    ongId: z.string().uuid('O identificador da ONG é inválido.')
  })
  .strict();