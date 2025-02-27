import express from 'express';
import { productController } from '../controllers/productController';
import { authenticate, isAdmin } from '../middleware/auth';

export const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);

// Admin routes
router.post('/', authenticate, isAdmin, productController.createProduct);
router.patch('/:id', authenticate, isAdmin, productController.updateProduct);
router.delete('/:id', authenticate, isAdmin, productController.deleteProduct);

export default router;