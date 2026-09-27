import { Router } from 'express';
import inventoryController from '../controllers/InventoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', inventoryController.listItems);
router.post('/', inventoryController.createItem);
router.get('/:id', inventoryController.getItem);
router.patch('/:id', inventoryController.updateItem);
router.delete('/:id', inventoryController.deleteItem);
router.get('/:id/movements', inventoryController.listMovements);
router.post('/:id/movements', inventoryController.createMovement);

export default router;