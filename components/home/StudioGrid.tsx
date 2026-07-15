import Link from 'next/link';

export default function StudioGrid() {
  return (
    <section className="container" id="studio">
      <div className="section-head">
        <div className="eyebrow">Beyond Outfits</div>
        <h2>Studio &amp; more</h2>
      </div>
      <div className="studio-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        <Link className="studio-card" href="/category/souvenirs" style={{
          background: '#fff', border: '1px solid rgba(59,18,32,0.08)', borderRadius: '3px',
          padding: '30px 24px', textDecoration: 'none', color: 'inherit', display: 'block',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <svg className="studio-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)', marginBottom: '16px' }}>
            <path d="M20 12v9H4v-9"/><path d="M2 7h20v5H2z"/><path d="M12 22V7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
          </svg>
          <h3 style={{ fontSize: '1.02rem', marginBottom: '6px' }}>Souvenirs</h3>
          <p style={{ fontSize: '0.87rem', color: '#4a423d', margin: 0 }}>Branded keepsakes and party favours for weddings, birthdays and special events.</p>
        </Link>
        
        <Link className="studio-card" href="/services/studio-booking" style={{
          background: '#fff', border: '1px solid rgba(59,18,32,0.08)', borderRadius: '3px',
          padding: '30px 24px', textDecoration: 'none', color: 'inherit', display: 'block',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <svg className="studio-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)', marginBottom: '16px' }}>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>
          </svg>
          <h3 style={{ fontSize: '1.02rem', marginBottom: '6px' }}>Studio Services</h3>
          <p style={{ fontSize: '0.87rem', color: '#4a423d', margin: 0 }}>Book our studio space for shoots, fittings and content sessions.</p>
        </Link>
        
        <Link className="studio-card" href="/services/equipment-rentals" style={{
          background: '#fff', border: '1px solid rgba(59,18,32,0.08)', borderRadius: '3px',
          padding: '30px 24px', textDecoration: 'none', color: 'inherit', display: 'block',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <svg className="studio-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)', marginBottom: '16px' }}>
            <line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/>
          </svg>
          <h3 style={{ fontSize: '1.02rem', marginBottom: '6px' }}>Equipment Rentals</h3>
          <p style={{ fontSize: '0.87rem', color: '#4a423d', margin: 0 }}>Cameras, lighting and backdrops available to rent by the day.</p>
        </Link>
        
        <Link className="studio-card" href="/services/photoshoot" style={{
          background: '#fff', border: '1px solid rgba(59,18,32,0.08)', borderRadius: '3px',
          padding: '30px 24px', textDecoration: 'none', color: 'inherit', display: 'block',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}>
          <svg className="studio-icon" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--gold)', marginBottom: '16px' }}>
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <h3 style={{ fontSize: '1.02rem', marginBottom: '6px' }}>Photoshoot Services</h3>
          <p style={{ fontSize: '0.87rem', color: '#4a423d', margin: 0 }}>Full styling-to-shutter packages, outfit included on request.</p>
        </Link>

      </div>
    </section>
  );
}
