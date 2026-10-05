import { Router } from 'express';
import projectController from '../controllers/ProjectController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRolesMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { idParamSchema } from '../schemas/commonSchemas.js';
import {
  createProjectSchema,
  updateProjectSchema
} from '../schemas/projectSchemas.js';

const router = Router();

router.use(authMiddleware, authorizeRoles('O'));

router.post('/', validate(createProjectSchema), projectController.create);

router.get('/', projectController.getByOng);

router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  projectController.getById
);

router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateProjectSchema),
  projectController.update
);

router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  projectController.delete
);
export default router;