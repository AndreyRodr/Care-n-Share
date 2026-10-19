import { z } from 'zod';

export const verificationListQuerySchema = z
  .object({
    status: z
      .enum(['PENDING', 'APPROVED', 'REJECTED'])
      .optional()
  })
  .strict();

export const reviewOngVerificationSchema = z
  .object({
    status: z.enum(['APPROVED', 'REJECTED']),

    rejectionReason: z
      .string()
      .trim()
      .min(5, 'Informe um motivo de rejeição com pelo menos 5 caracteres.')
      .max(1000, 'O motivo de rejeição deve ter no máximo 1000 caracteres.')
      .optional()
  })
  .strict()
  .superRefine((data, context) => {
    if (data.status === 'REJECTED' && !data.rejectionReason) {
      context.addIssue({
        code: 'custom',
        path: ['rejectionReason'],
        message: 'O motivo é obrigatório ao rejeitar uma ONG.'
      });
    }
  });

export const documentAccessParamsSchema = z
  .object({
    id: z.string().uuid('ID da ONG inválido.'),
    documentType: z.enum(['statute', 'addressProof'])
  })
  .strict();