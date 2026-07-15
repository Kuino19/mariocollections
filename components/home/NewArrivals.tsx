'use client';
import { useRef } from 'react';
import Link from 'next/link';
import { products } from '@/lib/data';

// Pull the first 6 products that are in stock
const arrivals = products.filter(p => p.inStock).slice(0, 6).map(p => ({
  image: p.images[0],
  category: p.category,
  title: p.name,
  link: `/product/${p.id}`,
}));

export default function NewArrivals() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -260, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 260, behavior: 'smooth' });
  };

  return (
    <>
      <div className="arrivals-wrap" style={{ background: '#fff' }}>
        <section className="container" id="arrivals">
          <div className="section-head left">
            <div>
              <div className="eyebrow">Fresh In</div>
              <h2>New arrivals</h2>
            </div>
            <div className="filmstrip-controls" style={{ display: 'flex', gap: '10px' }}>
              <button className="fs-btn" onClick={scrollLeft} aria-label="Scroll left" style={{
                width: '38px', height: '38px', borderRadius: '50%',
                border: '1px solid rgba(59,18,32,0.2)', background: 'none', color: 'var(--wine)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                transition: 'background 0.15s ease'
              }}>&#8249;</button>
              <button className="fs-btn" onClick={scrollRight} aria-label="Scroll right" style={{
                width: '38px', height: '38px', borderRadius: '50%',
                border: '1px solid rgba(59,18,32,0.2)', background: 'none', color: 'var(--wine)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem',
                transition: 'background 0.15s ease'
              }}>&#8250;</button>
            </div>
          </div>
          
          <div className="filmstrip" ref={scrollRef} style={{
            display: 'flex', gap: '18px', overflowX: 'auto', scrollSnapType: 'x mandatory',
            paddingBottom: '8px', scrollbarWidth: 'none'
          }}>
            {arrivals.map((item, i) => (
              <Link key={i} className="fs-card" href={item.link} style={{
                flex: '0 0 auto', width: '230px', scrollSnapAlign: 'start',
                textDecoration: 'none', color: 'inherit'
              }}>
                <div className="frame" style={{
                  borderRadius: '3px', overflow: 'hidden', aspectRatio: '4/5',
                  border: '1px solid rgba(59,18,32,0.1)'
                }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }} />
                </div>
                <div className="fs-label" style={{ marginTop: '10px' }}>
                  <span className="eyebrow" style={{ display: 'block', marginBottom: '2px' }}>{item.category}</span>
                  <h4 style={{ fontFamily: 'Fraunces,serif', fontWeight: 600, fontSize: '1.02rem', margin: 0 }}>{item.title}</h4>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
      <div className="weave"></div>
    </>
  );
}
