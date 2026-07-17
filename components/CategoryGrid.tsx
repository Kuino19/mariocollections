'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/data';

interface Props {
  initialMode: 'sale' | 'rent';
  products: Product[];
  searchQuery?: string;
}

export default function CategoryGrid({ initialMode, products, searchQuery = '' }: Props) {
  const [mode, setMode] = useState<'sale' | 'rent'>(initialMode);
  const [category, setCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'female-traditional', label: 'Female Traditional' },
    { id: 'male-traditional', label: 'Male Traditional' },
    { id: 'gowns', label: 'Gowns' },
    { id: 'suits', label: 'Suits' }
  ];

  // Filter products based on mode toggle, category, and search query
  const visibleProducts = products.filter(p => {
    const matchesMode = p.mode === 'both' || p.mode === mode;
    const matchesCategory = category === 'all' || p.category === category;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesMode && matchesCategory && matchesSearch;
  });

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
        {/* Mode Filter */}
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

        {/* Category Filter */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`btn ${category === cat.id ? 'btn-gold' : 'btn-outline-wine'}`}
              style={{ padding: '6px 16px', fontSize: '0.9rem', borderRadius: '999px' }}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        {/* Search Results Indicator */}
        {searchQuery && (
          <div style={{ color: '#4a423d', fontSize: '1.05rem', fontStyle: 'italic' }}>
            Showing results for "{searchQuery}"
          </div>
        )}
      </div>

      {visibleProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#4a423d' }}>
          No products found matching your criteria.
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
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div className="eyebrow" style={{ marginBottom: '4px' }}>
                    {mode === 'rent' ? 'Rental' : 'For Sale'} • {product.category.replace('-', ' ')}
                  </div>
                  <h3 style={{ fontSize: '1.05rem', margin: '0 0 8px' }}>{product.name}</h3>
                  <div style={{ fontWeight: 600, color: 'var(--wine)', marginTop: 'auto' }}>
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
