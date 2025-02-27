import { ProductModel, type IProduct, type Product } from '../models/Product';

class ProductService {
  async getAllProducts() {
    return ProductModel.find({ available: true });
  }

  async getProductById(id: string) {
    const product = await ProductModel.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async createProduct(productData: Product) {
    const product = await ProductModel.create(productData);
    return product;
  }

  async updateProduct(id: string, updateData: Partial<Product>) {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  async deleteProduct(id: string) {
    const product = await ProductModel.findByIdAndDelete(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}

export const productService = new ProductService();