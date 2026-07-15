'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/data';

interface Props {
  initialMode: 'sale' | 'rent';
  products: Product[];
}

export default function CategoryGrid({ initialMode, products }: Props) {
  const [mode, setMode] = useState<'sale' | 'rent'>(initialMode);

  // Filter products based on mode toggle. If mode is rent, only show products that support rent or both.
  const visibleProducts = products.filter(p => p.mode === 'both' || p.mode === mode);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
        <div style={{ display: 'flex', background: 'rgba(59,18,32,0.08)', borderRadius: '999px', padding: '4px' }}>
          <button
            onClick={() => setMode('sale')}
            className={`pill ${mode === 'sale' ? 'active' : ''}`}
            style={{ border: 'none', minWidth: '120px' }}
          >
            Buy
          </button>
          <button
            onClick={() => setMode('rent')}
            className={`pill ${mode === 'rent' ? 'active' : ''}`}
            style={{ border: 'none', minWidth: '120px' }}
          >
            Rent
          </button>
        </div>
      </div>

      {visibleProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#4a423d' }}>
          No products available for {mode} in this category.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          {visibleProducts.map(product => {
            const price = mode === 'rent' ? product.rentPrice : product.salePrice;
            return (
              <Link key={product.id} href={`/product/${product.id}`} style={{
                textDecoration: 'none', color: 'inherit',
                border: '1px solid rgba(59,18,32,0.1)', borderRadius: '3px',
                overflow: 'hidden', display: 'flex', flexDirection: 'column'
              }}>
                <div style={{ aspectRatio: '4/5', background: 'var(--wine)' }}>
                  <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ padding: '16px' }}>
                  <div className="eyebrow" style={{ marginBottom: '4px' }}>
                    {mode === 'rent' ? 'Rental' : 'For Sale'}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', margin: '0 0 8px' }}>{product.name}</h3>
                  <div style={{ fontWeight: 600, color: 'var(--wine)' }}>
                    ₦{price?.toLocaleString()} {mode === 'rent' && <span style={{ fontSize: '0.8rem', color: '#4a423d' }}>/ day</span>}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
