'use client';

import { useState } from 'react';
import { Product } from '@/lib/data';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';

export default function ProductDetailClient({ product }: { product: Product }) {
  const [mode, setMode] = useState<'sale' | 'rent'>(product.mode === 'both' ? 'sale' : product.mode);
  const [eventDate, setEventDate] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const addItem = useCartStore(state => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    if (mode === 'rent' && !eventDate) {
      alert("Please select an event date for the rental.");
      return;
    }

    // Default return date is 1 day after event date
    const returnDate = eventDate ? new Date(new Date(eventDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined;

    const cartId = `${product.id}-${mode}-${eventDate || 'keep'}-${selectedSize}`;

    addItem({
      id: cartId,
      productId: product.id,
      name: `${product.name} ${selectedSize ? `(${selectedSize})` : ''}`,
      category: product.category,
      mode: mode,
      price: mode === 'sale' ? (product.salePrice || 0) : (product.rentPrice || 0),
      quantity: 1,
      image: product.images[0],
      rentDeposit: mode === 'rent' ? product.rentDeposit : undefined,
      eventDate,
      returnDate
    });

    router.push('/cart');
  };

  const currentPrice = mode === 'sale' ? product.salePrice : product.rentPrice;

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '56px' }}>
      <div style={{ flex: '1 1 400px' }}>
        <div style={{
          aspectRatio: '4/5', background: 'var(--wine)', borderRadius: '3px',
          overflow: 'hidden', border: '1px solid rgba(59,18,32,0.1)'
        }}>
          <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <div className="eyebrow">{product.category.replace('-', ' ')}</div>
          <h1 style={{ fontSize: 'clamp(2rem, 3vw, 2.8rem)', margin: '0.2em 0 0.4em' }}>{product.name}</h1>
          <div style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--wine)' }}>
            ₦{currentPrice?.toLocaleString()} {mode === 'rent' && <span style={{ fontSize: '1rem', color: '#4a423d' }}>/ day</span>}
          </div>
        </div>

        <p style={{ color: '#4a423d', fontSize: '1.05rem', margin: 0 }}>
          {product.description}
        </p>

        {product.mode === 'both' && (
          <div>
            <div style={{ fontWeight: 600, marginBottom: '12px' }}>Purchase Option:</div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setMode('sale')}
                className={`btn ${mode === 'sale' ? 'btn-gold' : 'btn-outline-wine'}`}
                style={{ flex: 1, padding: '10px' }}
              >
                Buy Outright
              </button>
              <button
                onClick={() => setMode('rent')}
                className={`btn ${mode === 'rent' ? 'btn-gold' : 'btn-outline-wine'}`}
                style={{ flex: 1, padding: '10px' }}
              >
                Rent for Event
              </button>
            </div>
          </div>
        )}

        {product.sizes && product.sizes.length > 0 && (
          <div>
            <div style={{ fontWeight: 600, marginBottom: '12px' }}>Select Size:</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {product.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`btn ${selectedSize === size ? 'btn-gold' : 'btn-outline-wine'}`}
                  style={{ padding: '8px 16px', minWidth: '48px' }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'rent' && (
          <div style={{ background: 'rgba(201,162,39,0.1)', padding: '16px', borderRadius: '3px', border: '1px solid var(--line)' }}>
            <div style={{ fontWeight: 600, marginBottom: '12px' }}>Event Date:</div>
            <input
              type="date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
            />
            {product.rentDeposit && (
              <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#4a423d' }}>
                * A refundable deposit of <strong>₦{product.rentDeposit.toLocaleString()}</strong> will be added to this rental and returned when the outfit is returned in good condition.
              </div>
            )}
          </div>
        )}

        <button
          className="btn btn-gold"
          onClick={handleAddToCart}
          disabled={!product.inStock || (mode === 'rent' && !eventDate)}
          style={{ width: '100%', marginTop: 'auto', padding: '18px' }}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
}
