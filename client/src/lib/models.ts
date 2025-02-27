import { z } from "zod";

// Продуктов модел
export const productSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Името е задължително"),
  description: z.string(),
  price: z.number().min(0, "Цената трябва да е положително число"),
  imageUrl: z.string().url("Невалиден URL на изображението"),
  available: z.boolean().default(true),
  createdAt: z.date()
});

// Модел за поръчка
export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  total: z.number(),
  address: z.string(),
  location: z.object({
    lat: z.number(),
    lng: z.number()
  }),
  deliveryTime: z.date(),
  createdAt: z.date(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number()
  }))
});

export type Product = z.infer<typeof productSchema>;
export type Order = z.infer<typeof orderSchema>;
