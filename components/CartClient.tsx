'use client';
import { useEffect, useState } from 'react';
import { useCartStore } from '@/store/useCartStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartClient() {
  const [mounted, setMounted] = useState(false);
  const { items, removeItem, updateQuantity, getSaleItems, getRentItems, getTotalPrice } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 0' }}>
        <p style={{ color: '#4a423d', fontSize: '1.1rem', marginBottom: '24px' }}>Your bag is currently empty.</p>
        <Link href="/shop" className="btn btn-gold">Continue Shopping</Link>
      </div>
    );
  }

  const saleItems = getSaleItems();
  const rentItems = getRentItems();

  const renderCartItem = (item: any) => (
    <div key={item.id} style={{
      display: 'flex', gap: '20px', padding: '20px 0',
      borderBottom: '1px solid rgba(59,18,32,0.1)'
    }}>
      <div style={{ width: '100px', height: '125px', background: 'var(--wine)', borderRadius: '3px', overflow: 'hidden', flexShrink: 0 }}>
        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '1.05rem', fontFamily: 'Work Sans, sans-serif' }}>{item.name}</h4>
            <div className="eyebrow" style={{ color: '#4a423d' }}>{item.category.replace('-', ' ')}</div>
            {item.mode === 'rent' && item.eventDate && (
              <div style={{ fontSize: '0.85rem', color: 'var(--rust)', marginTop: '4px', fontWeight: 500 }}>
                Event Date: {new Date(item.eventDate).toLocaleDateString()}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, color: 'var(--wine)' }}>₦{(item.price * item.quantity).toLocaleString()}</div>
            {item.rentDeposit && (
              <div style={{ fontSize: '0.8rem', color: '#4a423d', marginTop: '4px' }}>
                + ₦{(item.rentDeposit * item.quantity).toLocaleString()} deposit
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              style={{ width: '28px', height: '28px', border: '1px solid var(--line)', background: 'transparent', borderRadius: '50%' }}
            >-</button>
            <span>{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              style={{ width: '28px', height: '28px', border: '1px solid var(--line)', background: 'transparent', borderRadius: '50%' }}
            >+</button>
          </div>
          <button
            onClick={() => removeItem(item.id)}
            style={{ border: 'none', background: 'transparent', color: 'var(--rust)', fontSize: '0.85rem', textDecoration: 'underline' }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
      <div style={{ flex: '1 1 60%' }}>
        {saleItems.length > 0 && (
          <div style={{ marginBottom: '40px' }}>
            <h3 style={{ borderBottom: '2px solid var(--gold)', paddingBottom: '12px', marginBottom: '0' }}>To Keep (Sales)</h3>
            <div>{saleItems.map(renderCartItem)}</div>
          </div>
        )}

        {rentItems.length > 0 && (
          <div>
            <h3 style={{ borderBottom: '2px solid var(--gold)', paddingBottom: '12px', marginBottom: '0' }}>To Return (Rentals/Bookings)</h3>
            <div>{rentItems.map(renderCartItem)}</div>
          </div>
        )}
      </div>

      <div style={{ flex: '1 1 30%', minWidth: '300px' }}>
        <div style={{ background: '#fff', border: '1px solid rgba(59,18,32,0.1)', padding: '24px', borderRadius: '3px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Order Summary</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span>Subtotal</span>
            <span>₦{getTotalPrice().toLocaleString()}</span>
          </div>
          
          <div style={{ borderTop: '1px solid rgba(59,18,32,0.1)', margin: '16px 0' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem', marginBottom: '24px' }}>
            <span>Total</span>
            <span>₦{getTotalPrice().toLocaleString()}</span>
          </div>

          <button className="btn btn-gold" style={{ width: '100%' }} onClick={() => router.push('/checkout')}>
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
