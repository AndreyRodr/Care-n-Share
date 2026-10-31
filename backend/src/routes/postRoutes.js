import { Router } from 'express';
import postController from '../controllers/PostController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../config/cloudinary.js';
import authorizeRoles from '../middlewares/authorizeRolesMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { ongIdParamSchema, idParamSchema } from '../schemas/commonSchemas.js';
import {
  createPostSchema,
  updatePostSchema
} from '../schemas/postSchemas.js';
import requireApprovedOng from '../middlewares/requireApprovedOngMiddleware.js';

const router = Router();

router.get('/', postController.getAll);
router.get(
  '/ong/:ongId',
  validate(ongIdParamSchema, 'params'),
  postController.getByOng
);

router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  postController.getById
);

const ongAuthorization = [
  authMiddleware,
  authorizeRoles('O'),
  requireApprovedOng
];

router.post(
  '/',
  ...ongAuthorization,
  upload.single('image'),
  validate(createPostSchema),
  postController.create
);

router.put(
  '/:id',
  ...ongAuthorization,
  validate(idParamSchema, 'params'),
  upload.single('image'),
  validate(updatePostSchema),
  postController.update
);

router.delete(
  '/:id',
  ...ongAuthorization,
  validate(idParamSchema, 'params'),
  postController.delete
);

export default router;
