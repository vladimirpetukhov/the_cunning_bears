import { CategoryModel, type ICategory, type CategoryInput } from '../models/Category';
import { defaultCategories } from '@shared/config/categories';

class CategoryService {
  async initializeDefaultCategories() {
    try {
      const existingCategories = await CategoryModel.find();
      
      if (existingCategories.length === 0) {
        await CategoryModel.insertMany(defaultCategories);
        console.log('Default categories initialized');
      }
    } catch (error) {
      console.error('Error initializing default categories:', error);
      throw error;
    }
  }

  async getAllCategories() {
    return CategoryModel.find({ isActive: true });
  }

  async getCategoryById(id: string) {
    const category = await CategoryModel.findOne({ id });
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async createCategory(categoryData: CategoryInput) {
    const existingCategory = await CategoryModel.findOne({ id: categoryData.id });
    if (existingCategory) {
      throw new Error('Category with this ID already exists');
    }
    
    const category = await CategoryModel.create(categoryData);
    return category;
  }

  async updateCategory(id: string, updateData: Partial<CategoryInput>) {
    const category = await CategoryModel.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  async toggleCategoryStatus(id: string, isActive: boolean) {
    const category = await CategoryModel.findOneAndUpdate(
      { id },
      { isActive },
      { new: true }
    );
    
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }
}

export const categoryService = new CategoryService();
