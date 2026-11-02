import { z } from 'zod';

const fundraisingGoalSchema = z.coerce
  .number()
  .min(0, 'A meta de arrecadação não pode ser negativa.')
  .default(0);

const fundraisingDeadlineSchema = z.preprocess(
  (value) => {
    if (value === '' || value === undefined || value === null) {
      return null;
    }

    return value;
  },
  z.coerce.date().nullable()
);

const postFields = {
  title: z
    .string()
    .trim()
    .min(3, 'O título deve ter pelo menos 3 caracteres.')
    .max(150, 'O título deve ter no máximo 150 caracteres.'),

  content: z
    .string()
    .trim()
    .min(1, 'O conteúdo da publicação é obrigatório.')
    .max(5000, 'O conteúdo deve ter no máximo 5000 caracteres.'),

  fundraisingGoal: fundraisingGoalSchema,

  fundraisingDeadline: fundraisingDeadlineSchema
};

export const createPostSchema = z
  .object(postFields)
  .strict()
  .superRefine((data, ctx) => {
    if (data.type === 'POST') {
      if (data.fundraisingGoal !== 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fundraisingGoal'],
          message: 'Publicações comuns não possuem meta de arrecadação.'
        });
      }

      if (data.fundraisingDeadline !== null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['fundraisingDeadline'],
          message: 'Publicações comuns não possuem data limite de arrecadação.'
        });
      }
    }
  });

export const updatePostSchema = z
  .object({
    title: postFields.title.optional(),
    content: postFields.content.optional(),
    fundraisingGoal: z.coerce
      .number()
      .min(0, 'A meta de arrecadação não pode ser negativa.')
      .optional(),
    amountRaised: z.coerce
      .number()
      .optional(),
    fundraisingDeadline: fundraisingDeadlineSchema.optional()
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: 'Informe pelo menos um campo para atualizar.'
    }
  );
