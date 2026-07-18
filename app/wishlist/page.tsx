'use client';

import { useWishlistStore } from '@/store/useWishlistStore';
import Link from 'next/link';
import Image from 'next/image';

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();

  return (
    <div style={{ padding: '60px 6vw', minHeight: '60vh' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '40px', color: 'var(--wine-deep)' }}>My Wishlist</h1>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(59,18,32,0.02)', borderRadius: '8px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🤍</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '16px' }}>Your Wishlist is Empty</h2>
          <p style={{ color: '#666', marginBottom: '24px' }}>Save items you love to view them later.</p>
          <Link href="/shop" className="btn btn-gold" style={{ display: 'inline-block' }}>
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '32px'
        }}>
          {items.map((item) => (
            <div key={item.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
              <Link href={`/product/${item.slug}`} className="product-card">
                <div className="image-wrapper" style={{ position: 'relative' }}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 33vw" />
                </div>
                <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div className="eyebrow" style={{ marginBottom: '8px', opacity: 0.85 }}>
                    {item.category.replace('-', ' ')}
                  </div>
                  <h3 style={{ fontSize: '1.2rem', margin: '0 0 14px', lineHeight: 1.35, color: 'var(--wine-deep)' }}>{item.name}</h3>
                  <div style={{ fontWeight: 700, color: 'var(--gold)', marginTop: 'auto', fontSize: '1.15rem' }}>
                    ₦{item.price?.toLocaleString()}
                  </div>
                </div>
              </Link>
              <button 
                onClick={(e) => { e.preventDefault(); removeItem(item.id); }}
                style={{
                  position: 'absolute', top: '12px', right: '12px', zIndex: 10,
                  background: 'white', border: 'none', width: '36px', height: '36px',
                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer', color: 'red'
                }}
                aria-label="Remove from wishlist"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
