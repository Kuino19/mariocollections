import Link from 'next/link';

export default function CategorySection() {
  return (
    <>
      <div className="categories-wrap" style={{ background: 'var(--ivory)' }}>
        <section className="container" id="categories">
          <div className="section-head">
            <div className="eyebrow">Rent or Buy</div>
            <h2>Shop by category</h2>
          </div>

          <div className="rows-tabs" style={{ display: 'flex', gap: '28px', marginBottom: '8px' }}>
            <span className="eyebrow on" style={{ paddingBottom: '10px', borderBottom: '2px solid var(--gold)', color: 'var(--wine)' }}>Outfit Rentals</span>
            <span className="eyebrow" style={{ paddingBottom: '10px', borderBottom: '2px solid transparent' }}>&amp;</span>
            <span className="eyebrow on" style={{ paddingBottom: '10px', borderBottom: '2px solid var(--gold)', color: 'var(--wine)' }}>Sales</span>
          </div>
          
          <div className="cat-rows" style={{ borderTop: '1px solid rgba(59,18,32,0.12)' }}>
            
            <div className="cat-row" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
              padding: '20px 4px', borderBottom: '1px solid rgba(59,18,32,0.12)'
            }}>
              <div className="cat-row-left" style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div className="cat-avatar" style={{
                  width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flex: '0 0 auto',
                  border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--wine)', color: 'var(--gold-soft)', fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1rem'
                }}>SU</div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Suits</h3>
              </div>
              <div className="cat-row-actions" style={{ display: 'flex', gap: '10px', flex: '0 0 auto' }}>
                <Link className="pill" href="/category/suits?type=rental">Rent</Link>
                <Link className="pill fill" href="/category/suits">Buy</Link>
              </div>
            </div>
            
            <div className="cat-row" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
              padding: '20px 4px', borderBottom: '1px solid rgba(59,18,32,0.12)'
            }}>
              <div className="cat-row-left" style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div className="cat-avatar" style={{
                  width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flex: '0 0 auto',
                  border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--wine)', color: 'var(--gold-soft)', fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1rem'
                }}>GO</div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Gowns</h3>
              </div>
              <div className="cat-row-actions" style={{ display: 'flex', gap: '10px', flex: '0 0 auto' }}>
                <Link className="pill" href="/category/gowns?type=rental">Rent</Link>
                <Link className="pill fill" href="/category/gowns">Buy</Link>
              </div>
            </div>

            <div className="cat-row" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
              padding: '20px 4px', borderBottom: '1px solid rgba(59,18,32,0.12)'
            }}>
              <div className="cat-row-left" style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div className="cat-avatar" style={{
                  width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flex: '0 0 auto',
                  border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--wine)', color: 'var(--gold-soft)', fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1rem'
                }}>
                  <img src="/products/male-traditional/brown-senator.jpeg" alt="Male traditional agbada outfit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Male Traditional Outfits</h3>
              </div>
              <div className="cat-row-actions" style={{ display: 'flex', gap: '10px', flex: '0 0 auto' }}>
                <Link className="pill" href="/category/male-traditional?type=rental">Rent</Link>
                <Link className="pill fill" href="/category/male-traditional">Buy</Link>
              </div>
            </div>

            <div className="cat-row" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
              padding: '20px 4px', borderBottom: '1px solid rgba(59,18,32,0.12)'
            }}>
              <div className="cat-row-left" style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div className="cat-avatar" style={{
                  width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flex: '0 0 auto',
                  border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--wine)', color: 'var(--gold-soft)', fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1rem'
                }}>
                  <img src="/products/female-traditional/pink-corset.jpeg" alt="Female traditional aso-ebi corset outfit" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Female Traditional Outfits</h3>
              </div>
              <div className="cat-row-actions" style={{ display: 'flex', gap: '10px', flex: '0 0 auto' }}>
                <Link className="pill" href="/category/female-traditional?type=rental">Rent</Link>
                <Link className="pill fill" href="/category/female-traditional">Buy</Link>
              </div>
            </div>

            <div className="cat-row" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
              padding: '20px 4px', borderBottom: '1px solid rgba(59,18,32,0.12)'
            }}>
              <div className="cat-row-left" style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div className="cat-avatar" style={{
                  width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flex: '0 0 auto',
                  border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--wine)', color: 'var(--gold-soft)', fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1rem'
                }}>SH</div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Shoes</h3>
              </div>
              <div className="cat-row-actions" style={{ display: 'flex', gap: '10px', flex: '0 0 auto' }}>
                <Link className="pill" href="/category/shoes?type=rental">Rent</Link>
                <Link className="pill fill" href="/category/shoes">Buy</Link>
              </div>
            </div>

            <div className="cat-row" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
              padding: '20px 4px', borderBottom: '1px solid rgba(59,18,32,0.12)'
            }}>
              <div className="cat-row-left" style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div className="cat-avatar" style={{
                  width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flex: '0 0 auto',
                  border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--wine)', color: 'var(--gold-soft)', fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1rem'
                }}>FA</div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Fans</h3>
              </div>
              <div className="cat-row-actions" style={{ display: 'flex', gap: '10px', flex: '0 0 auto' }}>
                <Link className="pill" href="/category/fans?type=rental">Rent</Link>
                <Link className="pill fill" href="/category/fans">Buy</Link>
              </div>
            </div>

            <div className="cat-row" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px',
              padding: '20px 4px', borderBottom: '1px solid rgba(59,18,32,0.12)'
            }}>
              <div className="cat-row-left" style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0 }}>
                <div className="cat-avatar" style={{
                  width: '56px', height: '56px', borderRadius: '50%', overflow: 'hidden', flex: '0 0 auto',
                  border: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--wine)', color: 'var(--gold-soft)', fontFamily: 'Fraunces, serif', fontWeight: 600, fontSize: '1rem'
                }}>AC</div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Accessories</h3>
              </div>
              <div className="cat-row-actions" style={{ display: 'flex', gap: '10px', flex: '0 0 auto' }}>
                <Link className="pill" href="/category/accessories?type=rental">Rent</Link>
                <Link className="pill fill" href="/category/accessories">Buy</Link>
              </div>
            </div>

          </div>
        </section>
      </div>
      <div className="weave"></div>
    </>
  );
}
