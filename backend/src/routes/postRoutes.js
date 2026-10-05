import { Router } from 'express';
import postController from '../controllers/PostController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../config/cloudinary.js';
import authorizeRoles from '../middlewares/authorizeRolesMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { ongIdParamSchema } from '../schemas/commonSchemas.js';
import { createPostSchema } from '../schemas/postSchemas.js';


const router = Router();

// Rotas de Posts
router.get('/', postController.getAll);
router.get(
  '/ong/:ongId',
  validate(ongIdParamSchema, 'params'),
  postController.getByOng
);
// Rota protegida para criar posts (Apenas ONGs)
router.post(
  '/',
  authMiddleware,
  authorizeRoles('O'),
  upload.single('image'),
  validate(createPostSchema),
  postController.create
);
export default router;
