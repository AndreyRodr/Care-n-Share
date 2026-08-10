import { Router } from 'express';
import userController from '../controllers/UserController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { upload } from '../config/cloudinary.js';

const router = Router();

// Rotas Públicas
router.post('/register', upload.single('profilePicture'), userController.register);
router.post('/login', userController.login);
router.get('/ongs', userController.listOngs);
router.get('/users/:id', userController.getProfile);

// Rotas Privadas (Necessitam de Token)
router.post('/ongs/:id/support', authMiddleware, userController.support);
router.delete('/ongs/:id/support', authMiddleware, userController.removeSupport);
router.put('/me', authMiddleware, upload.single('profilePicture'), userController.update);

export default router;
