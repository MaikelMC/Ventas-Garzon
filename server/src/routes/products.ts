import { Router } from 'express';
import * as productController from '../controllers/product.js';
import { demoMiddleware } from '../middleware/demo-middleware.js';

const router = Router();

// Public routes
router.get('/', productController.listProducts);
router.get('/search', productController.searchProductsHandler);
router.get('/:id', productController.getProduct);

// Demo mode: admin product routes bypass authentication
router.post('/', demoMiddleware, productController.createProductHandler);
router.put('/:id', demoMiddleware, productController.updateProductHandler);
router.delete('/:id', demoMiddleware, productController.deleteProductHandler);

export default router;
