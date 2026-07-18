import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string; // product id
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => set((state) => {
        if (state.items.find((i) => i.id === item.id)) {
          return state; // already in wishlist
        }
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      isInWishlist: (id) => !!get().items.find((i) => i.id === id),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'mariocollections-wishlist',
    }
  )
);
