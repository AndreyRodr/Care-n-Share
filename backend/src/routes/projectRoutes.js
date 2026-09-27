import { Router } from 'express';
import projectController from '../controllers/ProjectController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRolesMiddleware.js';

const router = Router();

router.use(authMiddleware, authorizeRoles('O'));

router.post('/', projectController.create);
router.get('/', projectController.getByOng);
router.get('/:id', projectController.getById);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

export default router;