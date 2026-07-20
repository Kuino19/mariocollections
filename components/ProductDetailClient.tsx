'use client';

import { useState } from 'react';
import { Product } from '@/lib/data';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import WishlistButton from './WishlistButton';

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
  const [mainImage, setMainImage] = useState<string>(product.images && product.images.length > 0 ? product.images[0] : '/logo.png');
  
  const addItem = useCartStore(state => state.addItem);
  const router = useRouter();

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewImages, setReviewImages] = useState<FileList | null>(null);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewRating || !reviewComment || !reviewAuthor) return;
    setIsSubmittingReview(true);
    
    try {
      const formData = new FormData();
      formData.append('productId', product.id);
      formData.append('rating', reviewRating.toString());
      formData.append('comment', reviewComment);
      formData.append('authorName', reviewAuthor);
      if (reviewImages) {
        for (let i = 0; i < reviewImages.length; i++) {
          formData.append('images', reviewImages[i]);
        }
      }

      const res = await fetch('/api/reviews', { method: 'POST', body: formData });
      if (res.ok) {
        toast.success('Review submitted successfully!');
        setShowReviewModal(false);
        // Refresh page to show review
        window.location.reload();
      } else {
        toast.error('Failed to submit review.');
      }
    } catch (err) {
      toast.error('An error occurred.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

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

  const reviews = (product as any).reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length 
    : 0;

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '56px', marginBottom: '80px' }}>
        {/* Interactive Image Gallery */}
        <div style={{ flex: '1 1 400px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            aspectRatio: '4/5', background: 'var(--wine)', borderRadius: '3px',
            overflow: 'hidden', border: '1px solid rgba(59,18,32,0.1)', position: 'relative'
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
            
            {/* Reviews Summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', color: 'var(--gold)' }}>
                {[1,2,3,4,5].map(star => (
                  <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill={star <= averageRating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <a href="#reviews" style={{ fontSize: '0.9rem', color: '#666', textDecoration: 'underline' }}>
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </a>
            </div>

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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontWeight: 600 }}>Select Size:</div>
                <button 
                  onClick={() => setShowSizeGuide(true)} 
                  style={{ background: 'none', border: 'none', color: '#666', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  📏 Size Guide
                </button>
              </div>
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
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn btn-gold"
                onClick={handleAddToCart}
                disabled={!product.inStock || (mode === 'rent' && !eventDate)}
                style={{ flex: 1, padding: '18px', fontSize: '1.1rem' }}
              >
                {product.inStock 
                  ? (mode === 'sale' ? 'Add Purchase to Cart' : 'Add Rental to Cart') 
                  : 'Out of Stock'}
              </button>
              
              <div style={{ position: 'relative', width: '60px', flexShrink: 0, border: '1px solid var(--line)', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WishlistButton product={product} size={selectedSize} absolute={false} />
              </div>
            </div>
            
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

      {/* Reviews Section */}
      <div id="reviews" style={{ borderTop: '1px solid var(--line)', paddingTop: '60px', marginTop: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '1.8rem', margin: 0 }}>Customer Reviews</h2>
          <button onClick={() => setShowReviewModal(true)} className="btn btn-outline-wine" style={{ padding: '8px 16px' }}>
            Write a Review
          </button>
        </div>

        {reviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(59,18,32,0.02)', borderRadius: '8px', color: '#666' }}>
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {reviews.map((review: any) => (
              <div key={review.id} style={{ padding: '24px', border: '1px solid var(--line)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ fontWeight: 600 }}>{review.authorName}</div>
                  <div style={{ display: 'flex', color: 'var(--gold)' }}>
                    {[1,2,3,4,5].map(star => (
                      <svg key={star} width="14" height="14" viewBox="0 0 24 24" fill={star <= review.rating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p style={{ margin: '0 0 16px', color: '#4a423d', lineHeight: 1.5 }}>{review.comment}</p>
                {review.images && review.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                    {review.images.map((img: string, i: number) => (
                      <img key={i} src={img} alt="Review photo" style={{ width: '80px', height: '100px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--line)' }} />
                    ))}
                  </div>
                )}
                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '12px' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
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
                  overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative'
                }}>
                  <div style={{ aspectRatio: '4/5', background: 'var(--wine)', position: 'relative' }}>
                    <WishlistButton product={rp} />
                    <img src={rp.images && rp.images.length > 0 ? rp.images[0] : '/logo.png'} alt={rp.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
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

      {/* Review Modal */}
      {showReviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', maxWidth: '500px', width: '100%', position: 'relative' }}>
            <button onClick={() => setShowReviewModal(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
            <h3 style={{ margin: '0 0 24px', fontSize: '1.5rem', color: 'var(--wine-deep)' }}>Write a Review</h3>
            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Rating</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1,2,3,4,5].map(star => (
                    <button key={star} type="button" onClick={() => setReviewRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', padding: 0 }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={star <= reviewRating ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Your Name *</label>
                <input type="text" value={reviewAuthor} onChange={e => setReviewAuthor(e.target.value)} required style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '4px' }} placeholder="e.g. Sarah" />
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Review *</label>
                <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} required rows={4} style={{ width: '100%', padding: '12px', border: '1px solid var(--line)', borderRadius: '4px' }} placeholder="Tell others about the fit, fabric, and your experience..."></textarea>
              </div>
              <div>
                <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>Add Photos (Optional)</label>
                <input type="file" accept="image/*" multiple onChange={e => setReviewImages(e.target.files)} style={{ width: '100%' }} />
              </div>
              <button type="submit" disabled={isSubmittingReview} className="btn btn-gold" style={{ marginTop: '8px', padding: '14px' }}>
                {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', padding: '32px', borderRadius: '8px', maxWidth: '600px', width: '100%', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setShowSizeGuide(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.5rem', color: 'var(--wine-deep)' }}>Size Guide</h3>
            <p style={{ color: '#666', marginBottom: '24px' }}>Measure yourself carefully. All measurements are in inches.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '24px' }}>
              <div>
                <h4 style={{ margin: '0 0 12px', color: 'var(--wine)' }}>Women's Sizing</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--wine)', color: 'var(--ivory)' }}>
                      <th style={{ padding: '12px' }}>Size</th>
                      <th style={{ padding: '12px' }}>Bust</th>
                      <th style={{ padding: '12px' }}>Waist</th>
                      <th style={{ padding: '12px' }}>Hip</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}><td style={{ padding: '12px', fontWeight: 600 }}>S (UK 8-10)</td><td style={{ padding: '12px' }}>34 - 35</td><td style={{ padding: '12px' }}>26 - 28</td><td style={{ padding: '12px' }}>36 - 38</td></tr>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}><td style={{ padding: '12px', fontWeight: 600 }}>M (UK 12)</td><td style={{ padding: '12px' }}>36 - 38</td><td style={{ padding: '12px' }}>29 - 31</td><td style={{ padding: '12px' }}>39 - 41</td></tr>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}><td style={{ padding: '12px', fontWeight: 600 }}>L (UK 14-16)</td><td style={{ padding: '12px' }}>39 - 41</td><td style={{ padding: '12px' }}>32 - 34</td><td style={{ padding: '12px' }}>42 - 44</td></tr>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}><td style={{ padding: '12px', fontWeight: 600 }}>XL (UK 18)</td><td style={{ padding: '12px' }}>42 - 44</td><td style={{ padding: '12px' }}>35 - 38</td><td style={{ padding: '12px' }}>45 - 48</td></tr>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}><td style={{ padding: '12px', fontWeight: 600 }}>XXL (UK 20+)</td><td style={{ padding: '12px' }}>45 - 48</td><td style={{ padding: '12px' }}>39 - 42</td><td style={{ padding: '12px' }}>49 - 52</td></tr>
                  </tbody>
                </table>
              </div>

              <div>
                <h4 style={{ margin: '0 0 12px', color: 'var(--wine)' }}>Men's Sizing (Suits & Traditional)</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ background: 'var(--wine)', color: 'var(--ivory)' }}>
                      <th style={{ padding: '12px' }}>Size</th>
                      <th style={{ padding: '12px' }}>Chest</th>
                      <th style={{ padding: '12px' }}>Trouser Waist</th>
                      <th style={{ padding: '12px' }}>Suit (EU)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}><td style={{ padding: '12px', fontWeight: 600 }}>S</td><td style={{ padding: '12px' }}>36 - 38</td><td style={{ padding: '12px' }}>30 - 32</td><td style={{ padding: '12px' }}>46 - 48</td></tr>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}><td style={{ padding: '12px', fontWeight: 600 }}>M</td><td style={{ padding: '12px' }}>39 - 41</td><td style={{ padding: '12px' }}>33 - 35</td><td style={{ padding: '12px' }}>50 - 52</td></tr>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}><td style={{ padding: '12px', fontWeight: 600 }}>L</td><td style={{ padding: '12px' }}>42 - 44</td><td style={{ padding: '12px' }}>36 - 38</td><td style={{ padding: '12px' }}>54</td></tr>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}><td style={{ padding: '12px', fontWeight: 600 }}>XL</td><td style={{ padding: '12px' }}>45 - 48</td><td style={{ padding: '12px' }}>39 - 42</td><td style={{ padding: '12px' }}>56 - 58</td></tr>
                    <tr style={{ borderBottom: '1px solid var(--line)' }}><td style={{ padding: '12px', fontWeight: 600 }}>XXL</td><td style={{ padding: '12px' }}>49 - 52</td><td style={{ padding: '12px' }}>43 - 46</td><td style={{ padding: '12px' }}>60+</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div style={{ background: 'rgba(201,162,39,0.1)', padding: '16px', borderRadius: '4px' }}>
              <strong style={{ display: 'block', marginBottom: '8px' }}>How to Measure:</strong>
              <ul style={{ margin: 0, paddingLeft: '20px', color: '#4a423d', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li><strong>Chest/Bust:</strong> Measure around the fullest part of your chest or bust.</li>
                <li><strong>Waist:</strong> Measure around the narrowest part of your natural waist (or where you normally wear your trousers).</li>
                <li><strong>Hip:</strong> Measure around the fullest part of your hips.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
