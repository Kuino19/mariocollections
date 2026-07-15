import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ProductMode, ProductCategory, ServiceType } from '../lib/data';

export interface CartItem {
  id: string; // unique cart item id (e.g., product.id + mode + eventDate)
  productId: string;
  name: string;
  category: ProductCategory | ServiceType | 'service';
  mode: ProductMode | 'booking';
  price: number;
  quantity: number;
  image: string;
  
  // Specific to rentals / bookings
  rentDeposit?: number;
  eventDate?: string;
  returnDate?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getSaleItems: () => CartItem[];
  getRentItems: () => CartItem[];
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.id === item.id);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id)
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map(i => i.id === id ? { ...i, quantity } : i)
      })),
      clearCart: () => set({ items: [] }),
      getSaleItems: () => get().items.filter(i => i.mode === 'sale'),
      getRentItems: () => get().items.filter(i => i.mode === 'rent' || i.mode === 'booking'),
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const itemTotal = (item.price * item.quantity);
          const depositTotal = item.rentDeposit ? (item.rentDeposit * item.quantity) : 0;
          return total + itemTotal + depositTotal;
        }, 0);
      }
    }),
    {
      name: 'mario-cart-storage',
    }
  )
);
