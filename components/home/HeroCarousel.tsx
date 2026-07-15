'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const slides = [
  {
    image: '/products/wine-aso-oke-iro-set/00000017-PHOTO-2026-07-15-19-52-03.jpg', 
    eyebrow: 'New This Week',
    title: (
      <>
        Dressed right, <em>every</em> occasion
      </>
    ),
    description: 'Agbada, aso-oke and aso-ebi styles you can buy outright or rent for the day — fitted to your event and your budget.',
    link: '/shop',
    btnText: 'Browse the Shop',
  },
  {
    image: '/products/royal-blue-agbada-set/00000025-PHOTO-2026-07-15-19-52-07.jpg', 
    eyebrow: 'Defense & Native Wear',
    title: (
      <>
        Senator sets, <em>sharpened</em>
      </>
    ),
    description: 'Emerald, navy, black and brown agbada with matching fila — tailored native wear for owambe and family events.',
    link: '/category/male-traditional',
    btnText: 'Shop Defense',
  },
  {
    image: '/products/pink-aso-ebi-corset/00000033-PHOTO-2026-07-15-19-52-09.jpg',
    eyebrow: 'Dinner & Formal',
    title: (
      <>
        Aso-ebi, <em>elevated</em>
      </>
    ),
    description: 'Laced corsets and formal aso-ebi pieces built for dinners, weddings and evening events.',
    link: '/category/female-traditional',
    btnText: 'Shop Dinner',
  },
  {
    image: '/products/sky-blue-double-breasted-suit/00000031-PHOTO-2026-07-15-19-52-08.jpg', 
    eyebrow: 'Milestones',
    title: (
      <>
        Graduation, <em>marked</em> in style
      </>
    ),
    description: 'Themed outfits for convocation day and the celebrations that follow — rent or buy.',
    link: '/category/suits',
    btnText: 'Shop Graduation',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <>
      <div className="hero-carousel" style={{
        position: 'relative',
        height: 'min(84vh, 680px)',
        minHeight: '460px',
        overflow: 'hidden',
        background: 'var(--wine-deep)',
      }}>
        {slides.map((slide, i) => (
          <div key={i} className={`slide ${i === current ? 'active' : ''}`} style={{
            position: 'absolute', inset: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1s ease',
            pointerEvents: i === current ? 'auto' : 'none',
          }}>
            <img src={slide.image} alt={slide.eyebrow} style={{
              width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%',
              filter: 'saturate(0.92) brightness(0.78)'
            }} />
            <div className="tint" style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(0deg, rgba(36,10,19,0.92) 8%, rgba(36,10,19,0.25) 48%, rgba(36,10,19,0.55) 100%)'
            }}></div>
            <div className="slide-content" style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              padding: '0 6vw 56px',
              maxWidth: '640px',
              color: 'var(--ivory)'
            }}>
              <div className="eyebrow">{slide.eyebrow}</div>
              <h1 style={{ fontSize: 'clamp(2.1rem, 4.8vw, 3.5rem)', margin: '0.25em 0 0.3em' }}>{slide.title}</h1>
              <p style={{ maxWidth: '460px', color: 'rgba(247,240,227,0.85)', margin: '0 0 1.7em' }}>{slide.description}</p>
              <Link href={slide.link} className="btn btn-gold">{slide.btnText}</Link>
            </div>
          </div>
        ))}
        
        <div className="slide-count" style={{
          position: 'absolute', top: '26px', right: '6vw',
          color: 'var(--gold-soft)', fontFamily: 'Fraunces, serif', fontStyle: 'italic',
          fontSize: '0.95rem', letterSpacing: '0.05em'
        }}>
          <span>{String(current + 1).padStart(2, '0')}</span> — {String(slides.length).padStart(2, '0')}
        </div>
        
        <div className="carousel-arrows" style={{
          position: 'absolute', top: '50%', left: 0, right: 0,
          display: 'flex', justifyContent: 'space-between',
          padding: '0 22px', transform: 'translateY(-50%)', zIndex: 5
        }}>
          <button className="arrow" onClick={prev} aria-label="Previous slide" style={{
            width: '44px', height: '44px', borderRadius: '50%', border: '1px solid var(--line)',
            background: 'rgba(36,10,19,0.45)', color: 'var(--ivory)', fontSize: '1.1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(2px)', transition: 'background 0.15s ease'
          }}>&#8249;</button>
          <button className="arrow" onClick={next} aria-label="Next slide" style={{
            width: '44px', height: '44px', borderRadius: '50%', border: '1px solid var(--line)',
            background: 'rgba(36,10,19,0.45)', color: 'var(--ivory)', fontSize: '1.1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(2px)', transition: 'background 0.15s ease'
          }}>&#8250;</button>
        </div>
        
        <div className="thread-dots" style={{
          position: 'absolute', bottom: '22px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '9px', zIndex: 5
        }}>
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)} aria-label={`Go to slide ${i + 1}`} style={{
              width: i === current ? '38px' : '26px', height: '5px', border: 'none', padding: 0,
              background: i === current ? 'var(--gold)' : 'rgba(247,240,227,0.35)',
              transition: 'background 0.2s ease, width 0.2s ease', cursor: 'pointer'
            }}></button>
          ))}
        </div>
      </div>
      <div className="weave"></div>
    </>
  );
}
