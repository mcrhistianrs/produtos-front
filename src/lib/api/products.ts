import { Product } from "@/types";
import { api } from "./client";

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await api.get("/products");
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    const response = await api.post("/products", product);
    return response.data;
  },

  update: async (product: Product): Promise<Product> => {
    const response = await api.put(`/products/${product.id}`, product);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
}; 