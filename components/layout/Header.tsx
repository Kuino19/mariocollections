'use client';

import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore';

export default function Header() {
  const items = useCartStore((state) => state.items);
  
  // Calculate total quantity
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

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
        borderBottom: '1px solid var(--line)'
      }}>
        <Link href="/">
          <img src="/logo.png" alt="Mario Collections" style={{ height: '40px', width: 'auto', display: 'block' }} />
        </Link>
        
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
      </header>
    </>
  );
}
