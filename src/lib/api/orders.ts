import { Order, OrderItem } from "@/types";
import { api } from "./client";

export interface CreateOrderRequest {
  items: OrderItem[];
}

export const orderService = {
  getAll: async (): Promise<Order[]> => {
    const response = await api.get("/orders");
    return response.data;
  },

  getById: async (id: string): Promise<Order> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  create: async (order: CreateOrderRequest): Promise<Order> => {
    const response = await api.post("/orders", order);
    return response.data;
  },

  updateStatus: async (id: string, status: Order["status"]): Promise<Order> => {
    const response = await api.patch(`/orders/${id}/status`, { status });
    return response.data;
  },
}; 