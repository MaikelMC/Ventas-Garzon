import { Router } from 'express';
import * as adminController from '../controllers/admin.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

router.get('/dashboard', authMiddleware, adminMiddleware, adminController.getDashboard);

router.get('/products', authMiddleware, adminMiddleware, adminController.listAllProducts);
router.post('/products', authMiddleware, adminMiddleware, adminController.createProduct);
router.put('/products/:id', authMiddleware, adminMiddleware, adminController.updateProduct);
router.delete('/products/:id', authMiddleware, adminMiddleware, adminController.deleteProduct);

router.get('/orders', authMiddleware, adminMiddleware, adminController.listAllOrders);
router.patch('/orders/:id/status', authMiddleware, adminMiddleware, adminController.updateOrderStatus);

router.get('/reservations/verify', authMiddleware, adminMiddleware, adminController.verifyReservation);
router.patch('/reservations/:id/confirm', authMiddleware, adminMiddleware, adminController.confirmReservation);
router.patch('/reservations/:id/cancel', authMiddleware, adminMiddleware, adminController.cancelReservation);

router.get('/users', authMiddleware, adminMiddleware, adminController.listAllUsers);
router.patch('/users/:id/role', authMiddleware, adminMiddleware, adminController.updateUserRole);
router.delete('/users/:id', authMiddleware, adminMiddleware, adminController.deleteUser);

router.get('/analytics/sales', authMiddleware, adminMiddleware, adminController.getSalesAnalytics);

export default router;
