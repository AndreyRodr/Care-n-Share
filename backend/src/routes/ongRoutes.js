import { Router } from 'express';
import ongDashboardController from '../controllers/OngDashboardController.js';
import donationController from '../controllers/DonationController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import authorizeRoles from '../middlewares/authorizeRolesMiddleware.js';

const router = Router();

router.use(authMiddleware, authorizeRoles('O'));

// --- Dashboard ---
router.get('/dashboard/summary', ongDashboardController.getSummary);
router.get('/dashboard/donations', ongDashboardController.getDonations);
router.get('/dashboard/goals', ongDashboardController.getGoals);
router.get('/dashboard/volunteers', ongDashboardController.getVolunteers);
router.get('/dashboard/activity', ongDashboardController.getActivity);

// --- Doações ---
router.get('/donations', donationController.getAll);
router.get('/donations/:id', donationController.getById);
router.patch('/donations/:id/complete', donationController.complete);
router.patch('/donations/:id/cancel', donationController.cancel);

export default router;