import { Router } from 'express';
import inventoryController from '../controllers/InventoryController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { idParamSchema } from '../schemas/commonSchemas.js';
import {
  createInventoryItemSchema,
  updateInventoryItemSchema,
  createInventoryMovementSchema,
  inventoryListQuerySchema,
  inventoryMovementQuerySchema
} from '../schemas/inventorySchemas.js';


const router = Router();

router.use(authMiddleware);

router.get(
  '/',
  validate(inventoryListQuerySchema, 'query'),
  inventoryController.listItems
);

router.post(
  '/',
  validate(createInventoryItemSchema),
  inventoryController.createItem
);

router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  inventoryController.getItem
);

router.patch(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(updateInventoryItemSchema),
  inventoryController.updateItem
);

router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  inventoryController.deleteItem
);

router.get(
  '/:id/movements',
  validate(idParamSchema, 'params'),
  inventoryController.listMovements
);

router.get(
  '/:id/movements',
  validate(idParamSchema, 'params'),
  validate(inventoryMovementQuerySchema, 'query'),
  inventoryController.listMovements
);

export default router;