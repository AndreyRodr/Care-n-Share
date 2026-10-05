import { Router } from 'express';
import causeController from '../controllers/CauseController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { idParamSchema } from '../schemas/commonSchemas.js';
import {
  createCauseSchema,
  updateCauseSchema
} from '../schemas/causeSchemas.js';

const router = Router();

router.get('/', causeController.getAll);

router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  causeController.getById
);

router.post(
  '/',
  authMiddleware,
  validate(createCauseSchema),
  causeController.create
);

router.put(
  '/:id',
  authMiddleware,
  validate(idParamSchema, 'params'),
  validate(updateCauseSchema),
  causeController.update
);

router.delete(
  '/:id',
  authMiddleware,
  validate(idParamSchema, 'params'),
  causeController.delete
);

export default router;