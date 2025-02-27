import express from 'express';
import { categoryController } from '../controllers/categoryController';
import { authenticate, isAdmin } from '../middleware/auth';

export const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Admin routes
router.post('/', authenticate, isAdmin, categoryController.createCategory);
router.patch('/:id', authenticate, isAdmin, categoryController.updateCategory);
router.patch('/:id/status', authenticate, isAdmin, categoryController.toggleCategoryStatus);

export default router;
