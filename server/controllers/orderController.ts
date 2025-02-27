import { Request, Response } from 'express';
import { orderService } from '../services/orderService';

export const orderController = {
  async getAllOrders(_req: Request, res: Response) {
    try {
      const orders = await orderService.getAllOrders();
      res.json(orders);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ message });
    }
  },

  async getUserOrders(req: Request, res: Response) {
    try {
      const orders = await orderService.getOrdersByUserId(req.userId!);
      res.json(orders);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(500).json({ message });
    }
  },

  async createOrder(req: Request, res: Response) {
    try {
      const orderData = {
        ...req.body,
        userId: req.userId!
      };
      const order = await orderService.createOrder(orderData);
      res.status(201).json(order);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({ message });
    }
  },

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const order = await orderService.updateOrderStatus(req.params.id, req.body.status);
      res.json(order);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      res.status(400).json({ message });
    }
  }
};