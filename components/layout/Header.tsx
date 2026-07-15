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
          <Link href="/cart" style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Cart
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
