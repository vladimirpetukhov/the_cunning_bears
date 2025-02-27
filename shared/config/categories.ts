export interface Category {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
}

export const defaultCategories: Category[] = [
  {
    id: 'donuts',
    name: 'Понички',
    description: 'Традиционни и специални понички',
    isActive: true
  },
  {
    id: 'corn',
    name: 'Царевица',
    description: 'Прясна и печена царевица',
    isActive: true
  },
  {
    id: 'drinks',
    name: 'Напитки',
    description: 'Топли и студени напитки',
    isActive: true
  },
  {
    id: 'other',
    name: 'Други',
    description: 'Други продукти',
    isActive: true
  }
];
