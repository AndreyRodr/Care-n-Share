import { z } from 'zod';

const MAX_QUANTITY = 999_999_999.999;

const hasAtMostThreeDecimalPlaces = (value) =>
  Number.isInteger(value * 1000);

const nonNegativeQuantity = z
  .coerce
  .number()
  .finite('A quantidade deve ser um número válido.')
  .min(0, 'A quantidade não pode ser negativa.')
  .max(MAX_QUANTITY, 'A quantidade informada é muito alta.')
  .refine(
    hasAtMostThreeDecimalPlaces,
    'A quantidade pode ter no máximo 3 casas decimais.'
  );

const positiveQuantity = z
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

export const createInventoryItemSchema = z
  .object({
    itemName: itemNameSchema,
    category: categorySchema,
    unit: unitSchema,
    quantity: nonNegativeQuantity.optional().default(0),
    minimumQuantity: nonNegativeQuantity.optional().default(0)
  })
  .strict();

export const updateInventoryItemSchema = z
  .object({
    itemName: itemNameSchema.optional(),
    category: categorySchema.optional(),
    unit: unitSchema.optional(),
    minimumQuantity: nonNegativeQuantity.optional()
  })
  .strict()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: 'Envie ao menos um campo para atualizar.' }
  );

export const createInventoryMovementSchema = z
  .object({
    type: z.enum(['ENTRADA', 'SAIDA'], {
      error: "O tipo deve ser 'ENTRADA' ou 'SAIDA'."
    }),

    quantity: positiveQuantity,

    reason: z
      .string()
      .trim()
      .min(3, 'O motivo deve ter pelo menos 3 caracteres.')
      .max(500, 'O motivo deve ter no máximo 500 caracteres.')
  })
  .strict();

const optionalFilterText = z
  .string()
  .trim()
  .min(1, 'O filtro não pode estar vazio.')
  .max(100, 'O filtro deve ter no máximo 100 caracteres.')
  .optional();

const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'A data deve estar no formato YYYY-MM-DD.')
  .refine(
    (value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(date.getTime()) &&
        date.toISOString().slice(0, 10) === value;
    },
    'Informe uma data válida.'
  );

export const inventoryListQuerySchema = z
  .object({
    search: optionalFilterText,
    category: optionalFilterText,
    status: z
      .enum(['NORMAL', 'ESTOQUE_BAIXO', 'SEM_ESTOQUE', 'TODOS', 'ALL'])
      .optional()
      .transform((value) =>
        value === 'TODOS' || value === 'ALL' ? undefined : value
      )
  })
  .strict();

export const inventoryMovementQuerySchema = z
  .object({
    type: z
      .enum(['ENTRADA', 'SAIDA', 'TODOS', 'ALL'])
      .optional()
      .transform((value) =>
        value === 'TODOS' || value === 'ALL' ? undefined : value
      ),

    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),

    page: z.coerce
      .number()
      .int('A página deve ser um número inteiro.')
      .min(1, 'A página deve ser maior que zero.')
      .max(100000, 'O número da página é muito alto.')
      .optional()
      .default(1),

    limit: z.coerce
      .number()
      .int('O limite deve ser um número inteiro.')
      .min(1, 'O limite deve ser maior que zero.')
      .max(100, 'O limite máximo por página é 100.')
      .optional()
      .default(10)
  })
  .strict()
  .refine(
    ({ startDate, endDate }) =>
      !startDate || !endDate || startDate <= endDate,
    {
      message: 'A data inicial não pode ser posterior à data final.',
      path: ['endDate']
    }
  );