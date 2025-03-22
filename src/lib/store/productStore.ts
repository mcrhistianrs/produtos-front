import { productService } from '@/lib/api'
import { Product } from '@/types'
import { create } from 'zustand'

interface ProductState {
  products: Product[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  getProduct: (id: string) => Product | undefined
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  
  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    try {
      const products = await productService.getAll()
      set({ products, isLoading: false })
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch products', 
        isLoading: false 
      })
    }
  },
  
  getProduct: (id: string) => {
    return get().products.find(product => product.id === id)
  }
})) 