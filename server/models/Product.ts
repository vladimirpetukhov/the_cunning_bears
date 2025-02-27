import mongoose from 'mongoose';
import { z } from 'zod';
import { defaultCategories } from '@shared/config/categories';

export interface IProduct extends mongoose.Document {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Името е задължително'],
    trim: true,
    minlength: [2, 'Името трябва да е поне 2 символа']
  },
  description: {
    type: String,
    required: [true, 'Описанието е задължително'],
    trim: true,
    minlength: [10, 'Описанието трябва да е поне 10 символа']
  },
  price: {
    type: Number,
    required: [true, 'Цената е задължителна'],
    min: [0, 'Цената трябва да е положително число']
  },
  imageUrl: {
    type: String,
    required: [true, 'URL на изображението е задължително'],
    validate: {
      validator: function(v: string) {
        try {
          new URL(v);
          return true;
        } catch (e) {
          return false;
        }
      },
      message: 'Невалиден URL на изображение'
    }
  },
  available: {
    type: Boolean,
    default: true
  },
  category: {
    type: String,
    required: [true, 'Категорията е задължителна'],
    enum: {
      values: defaultCategories.map(cat => cat.id),
      message: '{VALUE} не е валидна категория'
    }
  }
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Zod schema for validating incoming data
export const productValidationSchema = z.object({
  name: z.string().min(2, 'Името трябва да е поне 2 символа'),
  description: z.string().min(10, 'Описанието трябва да е поне 10 символа'),
  price: z.number().min(0, 'Цената трябва да е положително число'),
  imageUrl: z.string().url('Невалиден URL на изображение'),
  available: z.boolean().optional(),
  category: z.enum(defaultCategories.map(cat => cat.id) as [string, ...string[]])
});

export type Product = z.infer<typeof productValidationSchema>;
export const ProductModel = mongoose.model<IProduct>('Product', productSchema);