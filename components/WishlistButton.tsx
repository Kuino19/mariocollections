'use client';

import { useWishlistStore } from '@/store/useWishlistStore';
import { Product } from '@/lib/data';
import toast from 'react-hot-toast';

export default function WishlistButton({ product }: { product: Product }) {
  const { items, addItem, removeItem, isInWishlist } = useWishlistStore();
  
  const isWished = isInWishlist(product.id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWished) {
      removeItem(product.id);
      toast.success(`${product.name} removed from wishlist.`);
    } else {
      addItem({
        id: product.id,
        name: product.name,
        price: product.salePrice || product.rentPrice || 0,
        image: product.images[0],
        slug: product.slug,
        category: product.category,
      });
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      style={{
        position: 'absolute', top: '12px', right: '12px', zIndex: 10,
        background: 'rgba(255, 255, 255, 0.9)', border: 'none', width: '36px', height: '36px',
        borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer',
        color: isWished ? 'var(--wine)' : '#666',
        transition: 'all 0.2s ease',
      }}
      aria-label="Toggle Wishlist"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={isWished ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
    </button>
  );
}
