import { Router } from 'express';
import userController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../config/cloudinary.js';
import validate from '../middlewares/validateMiddleware.js';
import {
  loginSchema,
  registerSchema,
  updateProfileSchema
} from '../schemas/userSchemas.js';
import { idParamSchema } from '../schemas/commonSchemas.js';
const router = Router();

// Rotas Públicas
router.post(
  '/register',
  upload.single('profilePicture'),
  validate(registerSchema),
  userController.register
);

router.post('/login', validate(loginSchema), userController.login);
router.get('/ongs', userController.listOngs);
router.get(
  '/users/:id',
  validate(idParamSchema, 'params'),
  userController.getProfile
);
// Rotas Privadas (Necessitam de Token)
router.get('/me', authMiddleware, userController.getMe);
router.post('/logout', authMiddleware, userController.logout);
router.post(
  '/ongs/:id/support',
  authMiddleware,
  validate(idParamSchema, 'params'),
  userController.support
);

router.delete(
  '/ongs/:id/support',
  authMiddleware,
  validate(idParamSchema, 'params'),
  userController.removeSupport
);
router.put(
  '/me',
  authMiddleware,
  upload.single('profilePicture'),
  validate(updateProfileSchema),
  userController.update
);
export default router;
