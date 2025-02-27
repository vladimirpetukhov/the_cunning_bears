import express from 'express';
import { orderController } from '../controllers/orderController';
import { authenticate, isAdmin } from '../middleware/auth';

export const router = express.Router();

router.get('/my-orders', authenticate, orderController.getUserOrders);
router.post('/', authenticate, orderController.createOrder);

// Admin routes
router.get('/', authenticate, isAdmin, orderController.getAllOrders);
router.patch('/:id/status', authenticate, isAdmin, orderController.updateOrderStatus);

export default router;