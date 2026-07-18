'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/data';
import WishlistButton from './WishlistButton';

interface Props {
  initialMode: 'sale' | 'rent';
  products: Product[];
  searchQuery?: string;
}

export default function CategoryGrid({ initialMode, products, searchQuery = '' }: Props) {
  const [mode, setMode] = useState<'sale' | 'rent'>(initialMode);
  const [category, setCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 12;

  const categories = [
    { id: 'all', label: 'All Products' },
    { id: 'female-traditional', label: 'Female Traditional' },
    { id: 'male-traditional', label: 'Male Traditional' },
    { id: 'gowns', label: 'Gowns' },
    { id: 'suits', label: 'Suits' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'accessories', label: 'Accessories' }
  ];

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [mode, category, searchQuery]);

  // Filter products based on mode toggle, category, and search query
  const visibleProducts = products.filter(p => {
    const matchesMode = p.mode === 'both' || p.mode === mode;
    const matchesCategory = category === 'all' || p.category === category;
    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesMode && matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(visibleProducts.length / itemsPerPage);
  const paginatedProducts = visibleProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
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
          <div style={{ color: '#4a423d', fontSize: '1.05rem', fontStyle: 'italic', marginTop: '8px' }}>
            Showing results for "{searchQuery}"
          </div>
        )}
      </div>

      {visibleProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#4a423d' }}>
          No products found matching your criteria.
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '32px'
          }}>
            {paginatedProducts.map(product => {
              const price = mode === 'rent' ? product.rentPrice : product.salePrice;
              return (
                <Link key={product.id} href={`/product/${product.slug}`} className="product-card" style={{ position: 'relative' }}>
                  <div className="image-wrapper" style={{ position: 'relative' }}>
                    <WishlistButton product={product} />
                    <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                    <div className="badge-premium">
                      {mode === 'rent' ? 'Rental' : 'For Sale'}
                    </div>
                  </div>
                  <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="eyebrow" style={{ marginBottom: '8px', opacity: 0.85 }}>
                      {product.category.replace('-', ' ')}
                    </div>
                    <h3 style={{ fontSize: '1.2rem', margin: '0 0 14px', lineHeight: 1.35, color: 'var(--wine-deep)' }}>{product.name}</h3>
                    <div style={{ fontWeight: 700, color: 'var(--gold)', marginTop: 'auto', fontSize: '1.15rem' }}>
                      ₦{price?.toLocaleString()} {mode === 'rent' && <span style={{ fontSize: '0.85rem', color: '#888', fontWeight: 500 }}>/ day</span>}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '60px' }}>
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-outline-wine"
                style={{ padding: '8px 16px', borderRadius: '4px', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                &larr; Prev
              </button>
              
              <div style={{ display: 'flex', gap: '4px' }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`btn ${currentPage === page ? 'btn-wine' : 'btn-outline-wine'}`}
                    style={{ 
                      width: '40px', height: '40px', padding: 0, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      borderRadius: '4px', fontWeight: currentPage === page ? 700 : 500
                    }}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="btn btn-outline-wine"
                style={{ padding: '8px 16px', borderRadius: '4px', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
