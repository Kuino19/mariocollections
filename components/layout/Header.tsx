'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCartStore } from '../../store/useCartStore';

export default function Header() {
  const items = useCartStore((state) => state.items);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Calculate total quantity
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <div className="topbar" style={{
        background: 'var(--wine-deep)',
        color: 'var(--ivory)',
        textAlign: 'center',
        fontSize: '0.82rem',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span>
          Sale &amp; Rental of Native, Formal &amp; Themed Wear ·{' '}
          <a href="https://wa.me/2348113683580" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-soft)', fontWeight: 600 }}>
            Chat us on WhatsApp &rarr;
          </a>
        </span>
      </div>
      
      <header style={{
        padding: '20px 6vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--ivory)',
        borderBottom: '1px solid var(--line)',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <Link href="/">
          <img src="/logo.png" alt="Mario Collections" style={{ height: '40px', width: 'auto', display: 'block' }} />
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', position: 'relative' }}>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '8px 16px',
                paddingRight: '40px',
                borderRadius: '999px',
                border: '1px solid rgba(59,18,32,0.2)',
                background: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                width: '100%',
                minWidth: '200px'
              }}
            />
            <button type="submit" style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              color: 'var(--wine)',
              cursor: 'pointer'
            }} aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>

          <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/shop" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Shop</Link>
            <Link href="/cart" style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }} aria-label="Cart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {totalItems > 0 && (
                <span style={{
                  background: 'var(--wine)',
                  color: 'var(--ivory)',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
