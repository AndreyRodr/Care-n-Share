import { Router } from 'express';
import ongDashboardController from '../controllers/OngDashboardController.js';
import donationController from '../controllers/DonationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRolesMiddleware.js';
import validate from '../middlewares/validateMiddleware.js';
import { idParamSchema } from '../schemas/commonSchemas.js';
import {
  createDonationSchema,
  updateDonationSchema,
  cancelDonationSchema,
  donationListQuerySchema
} from '../schemas/donationSchemas.js';

const router = Router();

router.use(authMiddleware, authorizeRoles('O'));

// --- Dashboard ---
router.get('/dashboard/summary', ongDashboardController.getSummary);
router.get('/dashboard/donations', ongDashboardController.getDonations);
router.get('/dashboard/goals', ongDashboardController.getGoals);
router.get('/dashboard/volunteers', ongDashboardController.getVolunteers);
router.get('/dashboard/activity', ongDashboardController.getActivity);

// --- Doações ---
router.post(
  '/donations',
  validate(createDonationSchema),
  donationController.create
);

router.get(
  '/donations',
  validate(donationListQuerySchema, 'query'),
  donationController.getAll
);

router.get(
  '/donations/:id',
  validate(idParamSchema, 'params'),
  donationController.getById
);

router.put(
  '/donations/:id',
  validate(idParamSchema, 'params'),
  validate(updateDonationSchema),
  donationController.update
);

router.patch(
  '/donations/:id/complete',
  validate(idParamSchema, 'params'),
  donationController.complete
);

router.patch(
  '/donations/:id/cancel',
  validate(idParamSchema, 'params'),
  validate(cancelDonationSchema),
  donationController.cancel
);

router.delete(
  '/donations/:id',
  validate(idParamSchema, 'params'),
  donationController.delete
);

export default router;