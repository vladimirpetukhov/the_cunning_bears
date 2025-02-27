import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: User;
    }
  }
}

export const authenticate = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = await authService.validateToken(token);
    req.userId = decoded.userId;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate' });
  }
};

export const isAdmin = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const user = await User.findById(req.userId);
    if (!user?.isAdmin) {
      throw new Error('User is not an admin');
    }
    next();
  } catch (error) {
    res.status(403).json({ message: 'Access denied' });
  }
};