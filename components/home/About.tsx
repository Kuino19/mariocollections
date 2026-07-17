export default function About() {
  return (
    <>
      <section className="container" id="about">
        <div className="about" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '56px', alignItems: 'center' }}>
          <div className="about-visual" style={{
            aspectRatio: '4/5', borderRadius: '3px', overflow: 'hidden',
            border: '1px solid var(--line)', position: 'relative'
          }}>
            <img src="/about-us-hero.jpg" alt="White and gold gown with staff" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <span className="tag" style={{
              position: 'absolute', bottom: '16px', left: '16px',
              background: 'var(--gold)', color: 'var(--wine-deep)',
              fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.04em',
              padding: '6px 12px'
            }}>One of our styles</span>
          </div>
          <div>
            <div className="eyebrow">Why Mario Collections</div>
            <h2>Style made affordable and easy</h2>
            <p style={{ color: '#4a423d' }}>
              We stock ready-to-wear native and formal outfits, with a rental option so a big event doesn't need a big budget. Every order is confirmed and supported directly over WhatsApp.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '22px 0 0' }}>
              {[
                "Buy or rent — you choose per outfit",
                "Sizes from S to 2XL, most styles",
                "Direct WhatsApp support for orders and fitting",
                "New arrivals added weekly across all categories"
              ].map((item, i) => (
                <li key={i} style={{ padding: '10px 0 10px 26px', borderBottom: '1px solid rgba(59,18,32,0.08)', position: 'relative', fontSize: '0.95rem' }}>
                  <span style={{ position: 'absolute', left: 0, top: '18px', width: '10px', height: '2px', background: 'var(--gold)' }}></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="cta-banner" style={{ background: 'var(--wine-deep)', color: 'var(--ivory)', textAlign: 'center', padding: '64px 6vw' }}>
        <h2 style={{ color: 'var(--ivory)', fontSize: 'clamp(1.5rem,3vw,2.1rem)' }}>Have a specific outfit in mind?</h2>
        <p style={{ color: 'rgba(247,240,227,0.8)', maxWidth: '460px', margin: '0.6em auto 1.8em' }}>
          Send us a message with your event date, budget and size — we'll help you pick the right piece to buy or rent.
        </p>
        <a className="btn btn-gold" href="https://wa.me/2348113683580?text=Hi%21%20I%20have%20a%20question%20about%20your%20products." target="_blank" rel="noopener noreferrer">
          Message us on WhatsApp
        </a>
      </div>
    </>
  );
}
