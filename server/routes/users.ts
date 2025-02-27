import express from 'express';
import { userController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Protected routes - require authentication
router.get('/profile', authenticate, userController.getProfile);
router.patch('/profile', authenticate, userController.updateProfile);

export default router;
