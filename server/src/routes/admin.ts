import { Router } from 'express';
import * as adminController from '../controllers/admin.js';
import { demoMiddleware } from '../middleware/demo-middleware.js';

const router = Router();

// Demo mode: all admin routes bypass authentication
router.get('/dashboard', demoMiddleware, adminController.getDashboard);

router.get('/products', demoMiddleware, adminController.listAllProducts);
router.post('/products', demoMiddleware, adminController.createProduct);
router.put('/products/:id', demoMiddleware, adminController.updateProduct);
router.delete('/products/:id', demoMiddleware, adminController.deleteProduct);

router.get('/orders', demoMiddleware, adminController.listAllOrders);
router.patch('/orders/:id/status', demoMiddleware, adminController.updateOrderStatus);

router.get('/reservations/verify', demoMiddleware, adminController.verifyReservation);
router.patch('/reservations/:id/confirm', demoMiddleware, adminController.confirmReservation);
router.patch('/reservations/:id/cancel', demoMiddleware, adminController.cancelReservation);

router.get('/users', demoMiddleware, adminController.listAllUsers);
router.patch('/users/:id/role', demoMiddleware, adminController.updateUserRole);
router.delete('/users/:id', demoMiddleware, adminController.deleteUser);

router.get('/analytics/sales', demoMiddleware, adminController.getSalesAnalytics);

router.patch('/change-password', demoMiddleware, adminController.changePassword);

export default router;
