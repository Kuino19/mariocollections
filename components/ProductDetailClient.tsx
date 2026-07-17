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
              <div style={{ fontWeight: 600, marginBottom: '12px' }}>Choose Option:</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setMode('sale')}
                  className={`btn ${mode === 'sale' ? 'btn-gold' : 'btn-outline-wine'}`}
                  style={{ flex: 1, padding: '10px' }}
                >
                  Purchase (Buy)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('rent')}
                  className={`btn ${mode === 'rent' ? 'btn-gold' : 'btn-outline-wine'}`}
                  style={{ flex: 1, padding: '10px' }}
                >
                  Rent (Borrow)
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: 'auto' }}>
            <button
              className="btn btn-gold"
              onClick={handleAddToCart}
              disabled={!product.inStock || (mode === 'rent' && !eventDate)}
              style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}
            >
              {product.inStock 
                ? (mode === 'sale' ? 'Add Purchase to Cart' : 'Add Rental to Cart') 
                : 'Out of Stock'}
            </button>
            <a
              href={`https://wa.me/2348113683580?text=${encodeURIComponent(`Hello Mario Collections, I am interested in ${mode === 'sale' ? 'buying' : 'renting'} the *${product.name}* for ₦${currentPrice?.toLocaleString()}.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{ 
                width: '100%', 
                padding: '16px', 
                fontSize: '1rem', 
                background: '#25D366', 
                color: 'white', 
                display: 'flex', 
                gap: '8px', 
                justifyContent: 'center',
                alignItems: 'center',
                textDecoration: 'none'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
              </svg>
              Buy on WhatsApp
            </a>
          </div>
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
