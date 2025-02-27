import { OrderModel, type IOrder } from '../models/Order';
import { ProductModel } from '../models/Product';

class OrderService {
  async getAllOrders() {
    return OrderModel.find().populate('items.product');
  }

  async getOrdersByUserId(userId: string) {
    return OrderModel.find({ userId }).populate('items.product');
  }

  async getOrderById(id: string) {
    const order = await OrderModel.findById(id).populate('items.product');
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async createOrder(orderData: {
    userId: string;
    items: Array<{ productId: string; quantity: number }>;
    deliveryLocation: { latitude: number; longitude: number };
    deliveryTime: Date;
  }) {
    // Calculate total and validate products
    const items = await Promise.all(
      orderData.items.map(async (item) => {
        const product = await ProductModel.findById(item.productId);
        if (!product || !product.available) {
          throw new Error(`Product ${item.productId} is not available`);
        }
        return {
          product: item.productId,
          quantity: item.quantity,
          price: product.price
        };
      })
    );

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await OrderModel.create({
      ...orderData,
      items,
      total,
      status: 'pending'
    });

    return order.populate('items.product');
  }

  async updateOrderStatus(id: string, status: IOrder['status']) {
    const order = await OrderModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.product');

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }
}

export const orderService = new OrderService();