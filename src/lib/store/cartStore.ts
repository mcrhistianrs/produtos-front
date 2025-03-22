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
      
      addToCart: (product, quantity) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.productId === product.id
          );
          
          if (existingItemIndex !== -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += quantity;
            return { items: updatedItems };
          }
          
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                quantity,
                price: product.price,
                name: product.name,
                imageUrl: product.imageUrl
              },
            ],
          };
        });
      },
      
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter((item) => item.productId !== productId),
            };
          }

          const updatedItems = state.items.map((item) =>
            item.productId === productId ? { ...item, quantity } : item
          );

          return { items: updatedItems };
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      
      checkout: async () => {
        const items = get().items;

        if (items.length === 0) {
          set({ error: "Seu carrinho está vazio" });
          return;
        }

        set({ isLoading: true, error: null });
        try {
          const orderItems = items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }));

          await orderService.create({ items: orderItems });
          get().clearCart();
          set({ isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : "Falha ao finalizar pedido", 
            isLoading: false 
          });
        }
      }
    }),
    {
      name: 'cart-storage'
    }
  )
) 