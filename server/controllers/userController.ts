import { Request, Response } from 'express';
import { User } from '../models/User';
import { z } from 'zod';

const updateUserSchema = z.object({
  name: z.string().min(2, 'Името трябва да е поне 2 символа').optional(),
  phoneNumber: z.string().regex(/\d{10}/, 'Невалиден телефонен номер').optional(),
  deliveryAddresses: z.array(z.object({
    address: z.string(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
  })).optional()
});

export const userController = {
  async getProfile(req: Request, res: Response) {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(404).json({ message: 'Потребителят не е намерен' });
      }
      res.json(user);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ message });
    }
  },

  async updateProfile(req: Request, res: Response) {
    try {
      const updateData = updateUserSchema.parse(req.body);
      const user = await User.findByIdAndUpdate(
        req.userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ message: 'Потребителят не е намерен' });
      }

      res.json(user);
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: 'Validation error', 
          errors: error.errors 
        });
      }
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({ message });
    }
  }
};
