import { Router } from 'express';
import authMiddleware from '../middlewares/authMiddleware.js';
import requireAdmin from '../middlewares/requireAdminMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { idParamSchema } from '../schemas/commonSchemas.js';
import ongVerificationController from '../controllers/OngVerificationController.js';
import {
  documentAccessParamsSchema,
  reviewOngVerificationSchema,
  verificationListQuerySchema
} from '../schemas/ongVerificationSchemas.js';

const router = Router();

router.use(authMiddleware, requireAdmin);

router.get(
  '/ong-verifications',
  validate(verificationListQuerySchema, 'query'),
  ongVerificationController.list
);

router.get(
  '/ong-verifications/:id/documents/:documentType/preview',
  validate(documentAccessParamsSchema, 'params'),
  ongVerificationController.previewDocument
);

router.get(
  '/ong-verifications/:id/documents/:documentType',
  validate(documentAccessParamsSchema, 'params'),
  ongVerificationController.getDocumentAccessUrl
);

router.patch(
  '/ong-verifications/:id',
  validate(idParamSchema, 'params'),
  validate(reviewOngVerificationSchema),
  ongVerificationController.review
);

export default router;