import { z } from 'zod';

const MAX_QUANTITY = 999_999_999.999;

const hasAtMostThreeDecimalPlaces = (value) =>
  Number.isInteger(value * 1000);

const donationQuantitySchema = z
  .coerce
  .number()
  .finite('A quantidade deve ser um número válido.')
  .gt(0, 'A quantidade deve ser maior que zero.')
  .max(MAX_QUANTITY, 'A quantidade informada é muito alta.')
  .refine(
    hasAtMostThreeDecimalPlaces,
    'A quantidade pode ter no máximo 3 casas decimais.'
  );

const itemNameSchema = z
  .string()
  .trim()
  .min(2, 'O nome do item deve ter pelo menos 2 caracteres.')
  .max(120, 'O nome do item deve ter no máximo 120 caracteres.');

const categorySchema = z
  .string()
  .trim()
  .min(2, 'A categoria deve ter pelo menos 2 caracteres.')
  .max(80, 'A categoria deve ter no máximo 80 caracteres.');

const unitSchema = z
  .string()
  .trim()
  .min(1, 'A unidade é obrigatória.')
  .max(30, 'A unidade deve ter no máximo 30 caracteres.');

const donationTypeSchema = z.enum(['CREDIT', 'DEBIT', 'MONEY', 'PIX'], {
  error: 'O tipo da doação é inválido.'
});

export const createDonationSchema = z
  .object({
    itemName: itemNameSchema,
    category: categorySchema,
    quantity: donationQuantitySchema,
    type: donationTypeSchema,
    unit: unitSchema,
    donorId: z.string().uuid('O identificador do doador é inválido.'),
    projectId: z
      .string()
      .uuid('O identificador do projeto é inválido.')
      .optional()
      .nullable()
  })
  .strict();

export const updateDonationSchema = z
  .object({
    itemName: itemNameSchema.optional(),
    category: categorySchema.optional(),
    quantity: donationQuantitySchema.optional(),
    type: donationTypeSchema.optional(),
    unit: unitSchema.optional()
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: 'Envie ao menos um campo para atualizar.' }
  );

export const cancelDonationSchema = z
  .object({
    reason: z
      .string()
      .trim()
      .min(3, 'O motivo deve ter pelo menos 3 caracteres.')
      .max(500, 'O motivo deve ter no máximo 500 caracteres.')
      .optional()
  })
  .strict();

const optionalDonationFilter = z
  .string()
  .trim()
  .min(1, 'O filtro não pode estar vazio.')
  .max(100, 'O filtro deve ter no máximo 100 caracteres.')
  .optional();

export const donationListQuerySchema = z
  .object({
    search: optionalDonationFilter,

    status: z
      .enum([
        'PENDENTE',
        'PENDING',
        'CONCLUIDA',
        'CONCLUÍDA',
        'CHECKED_IN',
        'CANCELADO',
        'CANCELADA',
        'CANCELLED',
        'TODOS',
        'ALL'
      ])
      .optional()
      .transform((value) =>
        value === 'TODOS' || value === 'ALL' ? undefined : value
      ),

    type: z
      .enum(['CREDIT', 'DEBIT', 'MONEY', 'PIX', 'TODOS', 'ALL'])
      .optional()
      .transform((value) =>
        value === 'TODOS' || value === 'ALL' ? undefined : value
      )
  })
  .strict();