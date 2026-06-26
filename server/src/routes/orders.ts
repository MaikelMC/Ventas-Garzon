import { Router } from 'express';
import * as orderController from '../controllers/order.js';
import { demoMiddleware } from '../middleware/demo-middleware.js';

const router = Router();

// Demo mode: orders bypass authentication
router.post('/', demoMiddleware, orderController.createOrderHandler);
router.get('/', demoMiddleware, orderController.listOrders);
router.get('/:id', demoMiddleware, orderController.getOrderHandler);
router.patch('/:id/status', demoMiddleware, orderController.updateOrderStatusHandler);

export default router;
