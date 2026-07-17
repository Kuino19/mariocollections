'use client';

import { useState } from 'react';
import { Product } from '@/lib/data';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function ProductDetailClient({ 
  product, 
  relatedProducts = [] 
}: { 
  product: Product, 
  relatedProducts?: Product[] 
}) {
  const [mode, setMode] = useState<'sale' | 'rent'>(product.mode === 'both' ? 'sale' : (product.mode as 'sale' | 'rent'));
  const [eventDate, setEventDate] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
  const [mainImage, setMainImage] = useState<string>(product.images[0]);
  
  const addItem = useCartStore(state => state.addItem);
  const router = useRouter();

  const handleAddToCart = () => {
    if (mode === 'rent' && !eventDate) {
      toast.error("Please select an event date for the rental.");
      return;
    }

    // Default return date is 1 day after event date
    const returnDate = eventDate ? new Date(new Date(eventDate).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : undefined;

    const cartId = `${product.id}-${mode}-${eventDate || 'keep'}-${selectedSize}`;

    addItem({
      id: cartId,
      productId: product.id,
      name: `${product.name} ${selectedSize ? `(${selectedSize})` : ''}`,
      category: product.category as any,
      mode: mode,
      price: mode === 'sale' ? (product.salePrice || 0) : (product.rentPrice || 0),
      quantity: 1,
      image: product.images[0],
      rentDeposit: mode === 'rent' ? (product.rentDeposit || undefined) : undefined,
      eventDate,
      returnDate
    });

    toast.success((t) => (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <span style={{ fontWeight: 600 }}>{product.name} added to cart!</span>
        <button 
          onClick={() => { toast.dismiss(t.id); router.push('/cart'); }}
          className="btn btn-gold"
          style={{ padding: '6px 12px', fontSize: '0.85rem', alignSelf: 'flex-start', border: 'none', cursor: 'pointer', borderRadius: '3px' }}
        >
          View Cart &rarr;
        </button>
      </div>
    ), { duration: 5000 });
  };

  const currentPrice = mode === 'sale' ? product.salePrice : product.rentPrice;

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '56px', marginBottom: '80px' }}>
        {/* Interactive Image Gallery */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            aspectRatio: '4/5', background: 'var(--wine)', borderRadius: '3px',
            overflow: 'hidden', border: '1px solid rgba(59,18,32,0.1)'
          }}>
            <img src={mainImage} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px' }}>
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(img)}
                  style={{
                    width: '80px', height: '100px', flexShrink: 0,
                    border: mainImage === img ? '2px solid var(--gold)' : '1px solid rgba(59,18,32,0.1)',
                    borderRadius: '3px', overflow: 'hidden', padding: 0, cursor: 'pointer',
                    opacity: mainImage === img ? 1 : 0.7,
                    transition: 'opacity 0.2s'
                  }}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
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

          {product.measurements && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Measurements:</div>
              <div style={{ background: 'rgba(59,18,32,0.05)', padding: '12px', borderRadius: '3px', fontSize: '0.95rem' }}>
                {product.measurements}
              </div>
            </div>
          )}

          {product.accessories && (
            <div>
              <div style={{ fontWeight: 600, marginBottom: '8px' }}>Included Accessories:</div>
              <div style={{ background: 'rgba(59,18,32,0.05)', padding: '12px', borderRadius: '3px', fontSize: '0.95rem' }}>
                {product.accessories}
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

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div style={{ borderTop: '1px solid var(--line)', paddingTop: '60px', marginTop: '40px' }}>
          <h2 style={{ fontSize: '1.8rem', textAlign: 'center', marginBottom: '32px' }}>You Might Also Like</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            {relatedProducts.map(rp => {
              const rpPrice = rp.mode === 'sale' ? rp.salePrice : (rp.rentPrice || rp.salePrice);
              const rpModeDisplay = rp.mode === 'both' ? 'Buy or Rent' : (rp.mode === 'sale' ? 'For Sale' : 'Rental');
              
              return (
                <Link key={rp.id} href={`/product/${rp.slug}`} style={{
                  textDecoration: 'none', color: 'inherit',
                  border: '1px solid rgba(59,18,32,0.1)', borderRadius: '3px',
                  overflow: 'hidden', display: 'flex', flexDirection: 'column'
                }}>
                  <div style={{ aspectRatio: '4/5', background: 'var(--wine)' }}>
                    <img src={rp.images[0]} alt={rp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div className="eyebrow" style={{ marginBottom: '4px' }}>{rpModeDisplay}</div>
                    <h3 style={{ fontSize: '1.05rem', margin: '0 0 8px' }}>{rp.name}</h3>
                    <div style={{ fontWeight: 600, color: 'var(--wine)', marginTop: 'auto' }}>
                      ₦{rpPrice?.toLocaleString()}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
