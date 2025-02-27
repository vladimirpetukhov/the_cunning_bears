import mongoose from 'mongoose';
import { z } from 'zod';
import { Category } from '@shared/config/categories';

export interface ICategory extends mongoose.Document {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'ID е задължително'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Името е задължително'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Zod schema for validation
export const categoryValidationSchema = z.object({
  id: z.string().min(1, 'ID е задължително'),
  name: z.string().min(2, 'Името трябва да е поне 2 символа'),
  description: z.string().optional(),
  isActive: z.boolean().optional()
});

export type CategoryInput = z.infer<typeof categoryValidationSchema>;
export const CategoryModel = mongoose.model<ICategory>('Category', categorySchema);
