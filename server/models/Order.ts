import mongoose from 'mongoose';
import { z } from 'zod';
import { IProduct } from './Product';

export interface IOrderItem {
  product: IProduct['_id'];
  quantity: number;
  price: number;
}

export interface IOrder extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  deliveryLocation: {
    latitude: number;
    longitude: number;
  };
  deliveryTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Продуктът е задължителен']
  },
  quantity: {
    type: Number,
    required: [true, 'Количеството е задължително'],
    min: [1, 'Количеството трябва да е поне 1']
  },
  price: {
    type: Number,
    required: [true, 'Цената е задължителна'],
    min: [0, 'Цената трябва да е положително число']
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Потребителят е задължителен']
  },
  items: {
    type: [orderItemSchema],
    required: [true, 'Поръчката трябва да има поне един продукт'],
    validate: [
      {
        validator: function(items: IOrderItem[]) {
          return items.length > 0;
        },
        message: 'Поръчката трябва да има поне един продукт'
      }
    ]
  },
  total: {
    type: Number,
    required: [true, 'Общата сума е задължителна'],
    min: [0, 'Общата сума трябва да е положително число']
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'confirmed', 'completed', 'cancelled'],
      message: '{VALUE} не е валиден статус'
    },
    default: 'pending'
  },
  deliveryLocation: {
    latitude: {
      type: Number,
      required: [true, 'Latitude е задължителен'],
      min: -90,
      max: 90
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude е задължителен'],
      min: -180,
      max: 180
    }
  },
  deliveryTime: {
    type: Date,
    required: [true, 'Часът за доставка е задължителен'],
    validate: {
      validator: function(v: Date) {
        return v > new Date();
      },
      message: 'Часът за доставка трябва да е в бъдещето'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Zod schema for validation of incoming data
export const orderValidationSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })).min(1),
  deliveryLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
  }),
  deliveryTime: z.date().refine(date => date > new Date(), {
    message: 'Часът за доставка трябва да е в бъдещето'
  })
});

export type Order = z.infer<typeof orderValidationSchema>;
export const OrderModel = mongoose.model<IOrder>('Order', orderSchema);
