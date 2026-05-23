import { Router } from 'express';
import postController from '../controllers/PostController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// Rotas de Posts
router.get('/', postController.getAll);
router.get('/ong/:ongId', postController.getByOng);

// Rota protegida para criar posts (Apenas ONGs)
router.post('/', authMiddleware, postController.create);

export default router;
