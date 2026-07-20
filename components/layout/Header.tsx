'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

export default function Header() {
  const items = useCartStore((state) => state.items);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Fetch current user and sync wishlist
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
            const store = useWishlistStore.getState();
            store.setIsLoggedIn(true);
            
            // Sync Wishlist
            try {
              const wlRes = await fetch('/api/wishlist');
              if (wlRes.ok) {
                const dbItems = await wlRes.json();
                const localItems = store.items;
                
                // Find items in local that are not in DB
                const missingInDb = localItems.filter(local => 
                  !dbItems.find((db: any) => db.id === local.id && (db.size || '') === (local.size || ''))
                );
                
                if (missingInDb.length > 0) {
                  // Sync missing items to DB
                  await fetch('/api/wishlist', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ items: missingInDb })
                  });
                }
                
                // Merge DB items into local
                const missingInLocal = dbItems.filter((db: any) => 
                  !localItems.find(local => local.id === db.id && (local.size || '') === (db.size || ''))
                );
                
                if (missingInLocal.length > 0) {
                  store.setItems([...localItems, ...missingInLocal]);
                }
              }
            } catch (err) {
              console.error('Failed to sync wishlist', err);
            }
          }
        }
      } catch (e) {
        console.error('Failed to fetch user', e);
      }
    };
    fetchUser();
  }, []);
  
  // Calculate total quantity
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  // Handle live search
  useEffect(() => {
    const fetchResults = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        setShowDropdown(false);
        return;
      }

      setIsSearching(true);
      setShowDropdown(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <div className="topbar" style={{
        background: 'var(--wine-deep)',
        color: 'var(--ivory)',
        textAlign: 'center',
        fontSize: '0.82rem',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span>
          Sale &amp; Rental of Native, Formal &amp; Themed Wear ·{' '}
          <a href="https://wa.me/2348113683580" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--gold-soft)', fontWeight: 600 }}>
            Chat us on WhatsApp &rarr;
          </a>
        </span>
      </div>
      
      <header className="main-header" style={{
        padding: '20px 6vw',
        background: 'var(--ivory)',
        borderBottom: '1px solid var(--line)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          {/* Logo */}
          <Link href="/">
            <img src="/logo.png" alt="Mario Collections" style={{ height: '40px', width: 'auto', display: 'block' }} />
          </Link>

          {/* Desktop Search */}
          <div className="header-search-desktop" style={{ flex: 1, maxWidth: '500px', position: 'relative' }}>
            <form onSubmit={handleSearch} style={{ display: 'flex', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim().length >= 2) setShowDropdown(true);
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                style={{
                  padding: '10px 16px',
                  paddingRight: '40px',
                  borderRadius: '999px',
                  border: '1px solid rgba(59,18,32,0.2)',
                  background: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                  width: '100%'
                }}
              />
              <button type="submit" style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--wine)',
                cursor: 'pointer',
                padding: '4px'
              }} aria-label="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>

            {/* Live Search Dropdown */}
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                right: 0,
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                border: '1px solid var(--line)',
                zIndex: 100,
                overflow: 'hidden'
              }}>
                {isSearching ? (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>Searching...</div>
                ) : searchResults.length > 0 ? (
                  <>
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {searchResults.map((product) => (
                        <Link 
                          key={product.id} 
                          href={`/product/${product.slug}`}
                          onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px 16px', borderBottom: '1px solid rgba(0,0,0,0.05)',
                            textDecoration: 'none', color: 'inherit', transition: 'background 0.2s'
                          }}
                          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(59,18,32,0.03)'}
                          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          {product.images?.[0] && (
                            <img src={product.images[0]} alt="" style={{ width: '40px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                          )}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--wine-deep)' }}>
                              {product.name}
                            </div>
                            <div className="eyebrow" style={{ fontSize: '0.65rem' }}>{product.category.replace('-', ' ')}</div>
                          </div>
                          <div style={{ fontWeight: 600, color: 'var(--gold)', fontSize: '0.9rem' }}>
                            ₦{(product.mode === 'sale' ? product.salePrice : (product.rentPrice || product.salePrice))?.toLocaleString()}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Link 
                      href={`/shop?q=${encodeURIComponent(searchQuery.trim())}`}
                      onClick={() => { setSearchQuery(''); setShowDropdown(false); }}
                      style={{
                        display: 'block', padding: '12px', textAlign: 'center',
                        background: 'rgba(59,18,32,0.02)', fontWeight: 600, fontSize: '0.9rem',
                        color: 'var(--wine)', textDecoration: 'none'
                      }}
                    >
                      View all results &rarr;
                    </Link>
                  </>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', color: '#666', fontSize: '0.9rem' }}>No products found</div>
                )}
              </div>
            )}
          </div>
          
          {/* Desktop Nav & Cart */}
          <div className="header-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <nav style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
              <Link href="/shop" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Shop</Link>
            </nav>
            <Link href={user ? "/account" : "/login"} style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }} aria-label="Account">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </Link>
            <Link href="/wishlist" style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }} aria-label="Wishlist">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </Link>
            <Link href="/cart" style={{ fontWeight: 600, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '6px' }} aria-label="Cart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {totalItems > 0 && (
                <span style={{
                  background: 'var(--wine)',
                  color: 'var(--ivory)',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem'
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle & Cart */}
          <div className="header-mobile-controls" style={{ display: 'none', alignItems: 'center', gap: '16px' }}>
            <Link href="/cart" style={{ display: 'flex', alignItems: 'center', position: 'relative' }} aria-label="Cart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              {totalItems > 0 && (
                <span style={{
                  position: 'absolute', top: '-8px', right: '-8px',
                  background: 'var(--wine)', color: 'var(--ivory)',
                  borderRadius: '50%', width: '18px', height: '18px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 600
                }}>
                  {totalItems}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ background: 'none', border: 'none', padding: '4px', cursor: 'pointer', color: 'var(--wine-deep)' }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {isMobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Expandable Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu-dropdown" style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            background: 'var(--ivory)', borderBottom: '1px solid var(--line)',
            padding: '20px 6vw', display: 'flex', flexDirection: 'column', gap: '20px',
            zIndex: 90, boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
          }}>
            <form onSubmit={(e) => { handleSearch(e); setIsMobileMenuOpen(false); }} style={{ display: 'flex', position: 'relative' }}>
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '12px 16px', paddingRight: '44px',
                  borderRadius: '999px', border: '1px solid rgba(59,18,32,0.2)',
                  background: '#fff', fontSize: '1rem', outline: 'none', width: '100%'
                }}
              />
              <button type="submit" style={{
                position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--wine)', cursor: 'pointer', padding: '4px'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </button>
            </form>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1.1rem', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>Home</Link>
              <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1.1rem', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>All Products</Link>
              <Link href={user ? "/account" : "/login"} onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1.1rem', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>My Account</Link>
              <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1.1rem', padding: '8px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>My Wishlist</Link>
              <Link href="/cart" onClick={() => setIsMobileMenuOpen(false)} style={{ fontWeight: 600, fontSize: '1.1rem', padding: '8px 0' }}>Shopping Cart ({totalItems})</Link>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
