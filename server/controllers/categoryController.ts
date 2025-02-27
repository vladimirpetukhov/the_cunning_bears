import { Request, Response } from 'express';
import { categoryService } from '../services/categoryService';
import { categoryValidationSchema } from '../models/Category';
import { z } from 'zod';

export const categoryController = {
  async getAllCategories(_req: Request, res: Response) {
    try {
      const categories = await categoryService.getAllCategories();
      res.json(categories);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ message });
    }
  },

  async getCategoryById(req: Request, res: Response) {
    try {
      const category = await categoryService.getCategoryById(req.params.id);
      res.json(category);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(404).json({ message });
    }
  },

  async createCategory(req: Request, res: Response) {
    try {
      const categoryData = categoryValidationSchema.parse(req.body);
      const category = await categoryService.createCategory(categoryData);
      res.status(201).json(category);
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
  },

  async updateCategory(req: Request, res: Response) {
    try {
      const updateData = categoryValidationSchema.partial().parse(req.body);
      const category = await categoryService.updateCategory(req.params.id, updateData);
      res.json(category);
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
  },

  async toggleCategoryStatus(req: Request, res: Response) {
    try {
      const { isActive } = z.object({ isActive: z.boolean() }).parse(req.body);
      const category = await categoryService.toggleCategoryStatus(req.params.id, isActive);
      res.json(category);
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
