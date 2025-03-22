export enum CategoryEnum {
  FOOD = 'food',
  BEVERAGE = 'beverage',
  SNACK = 'snack',
}

export interface Product {
  id: string;
  name: string;
  category: CategoryEnum;
  price: number;
  description: string;
  imageUrl: string;
  quantityInStock: number;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
} 