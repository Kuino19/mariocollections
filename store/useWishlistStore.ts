import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string; // product id
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  size?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  isLoggedIn: boolean;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string, size?: string) => void;
  isInWishlist: (id: string, size?: string) => boolean;
  clearWishlist: () => void;
  setItems: (items: WishlistItem[]) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      isLoggedIn: false,
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
      setItems: (items) => set({ items }),
      addItem: (item) => {
        set((state) => {
          if (state.items.find((i) => i.id === item.id && (i.size || '') === (item.size || ''))) {
            return state; // already in wishlist
          }
          return { items: [...state.items, item] };
        });
        if (get().isLoggedIn) {
          fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: item.id, size: item.size })
          }).catch(console.error);
        }
      },
      removeItem: (id, size = '') => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && (i.size || '') === size)),
        }));
        if (get().isLoggedIn) {
          fetch(`/api/wishlist?productId=${id}&size=${encodeURIComponent(size)}`, {
            method: 'DELETE'
          }).catch(console.error);
        }
      },
      isInWishlist: (id, size = '') => !!get().items.find((i) => i.id === id && (i.size || '') === size),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'mariocollections-wishlist',
    }
  )
);
