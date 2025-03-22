import { orderService } from '@/lib/api';
import { OrderItem, Product } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem extends OrderItem {
  name: string;
  imageUrl: string;
}

interface CartState {
  items: CartItem[]
  isLoading: boolean
  error: string | null
  addToCart: (product: Product, quantity: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotal: () => number
  checkout: () => Promise<void>
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,
      error: null,
      
      addToCart: (product: Product, quantity: number) => {
        const { items } = get()
        const existingItem = items.find(item => item.productId === product.id)
        
        if (existingItem) {
          // Update quantity if item already exists
          set({
            items: items.map(item => 
              item.productId === product.id 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            )
          })
        } else {
          // Add new item
          set({
            items: [...items, {
              productId: product.id,
              name: product.name,
              imageUrl: product.imageUrl,
              quantity,
              price: product.price
            }]
          })
        }
      },
      
      removeFromCart: (productId: string) => {
        const { items } = get()
        set({
          items: items.filter(item => item.productId !== productId)
        })
      },
      
      updateQuantity: (productId: string, quantity: number) => {
        const { items } = get()
        if (quantity <= 0) {
          set({
            items: items.filter(item => item.productId !== productId)
          })
        } else {
          set({
            items: items.map(item => 
              item.productId === productId 
                ? { ...item, quantity } 
                : item
            )
          })
        }
      },
      
      clearCart: () => {
        set({ items: [] })
      },
      
      getTotal: () => {
        const { items } = get()
        return items.reduce((total, item) => total + (item.price * item.quantity), 0)
      },
      
      checkout: async () => {
        const { items, clearCart } = get()
        
        if (items.length === 0) {
          set({ error: 'Your cart is empty' })
          return
        }
        
        set({ isLoading: true, error: null })
        try {
          // Format items for the API
          const orderItems = items.map(({ productId, quantity, price }) => ({
            productId,
            quantity,
            price
          }))
          
          await orderService.create({ items: orderItems })
          
          // Clear cart after successful checkout
          clearCart()
          set({ isLoading: false })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Checkout failed',
            isLoading: false 
          })
        }
      }
    }),
    {
      name: 'cart-storage'
    }
  )
) 