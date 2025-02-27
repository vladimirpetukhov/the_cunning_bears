import { Category, defaultCategories } from './categories';

export interface AppConfig {
  app: {
    name: string;
    description: string;
    version: string;
  };
  categories: Category[];
  orders: {
    minDeliveryTime: number; // минимално време за доставка в минути
    maxDeliveryTime: number; // максимално време за доставка в минути
    deliveryRadius: number; // максимален радиус за доставка в километри
  };
  validation: {
    password: {
      minLength: number;
      requireSpecialChar: boolean;
      requireNumber: boolean;
    };
    phone: {
      pattern: string;
      message: string;
    };
  };
}

export const defaultConfig: AppConfig = {
  app: {
    name: 'Хитрите Мечоци',
    description: 'Доставка на понички и царевица',
    version: '1.0.0'
  },
  categories: defaultCategories,
  orders: {
    minDeliveryTime: 30,
    maxDeliveryTime: 90,
    deliveryRadius: 10
  },
  validation: {
    password: {
      minLength: 6,
      requireSpecialChar: true,
      requireNumber: true
    },
    phone: {
      pattern: '\\d{10}',
      message: 'Телефонният номер трябва да съдържа 10 цифри'
    }
  }
};
