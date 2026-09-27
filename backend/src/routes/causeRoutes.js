import { Router } from 'express';
import causeController from '../controllers/CauseController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', causeController.getAll);
router.get('/:id', causeController.getById);
router.post('/', authMiddleware, causeController.create);
router.put('/:id', authMiddleware, causeController.update);
router.delete('/:id', authMiddleware, causeController.delete);

export default router;