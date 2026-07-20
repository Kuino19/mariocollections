'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

export default function AccountClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'measurements' | 'addresses' | 'wishlist'>('profile');
  const router = useRouter();

  // Profile Form State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    shippingAddress: user.shippingAddress || '',
    billingAddress: user.billingAddress || '',
  });

  // Measurements Form State
  const defaultMeasurements = user.measurements || { chest: '', waist: '', shoulder: '', hip: '', trouserLength: '' };
  const [measurements, setMeasurements] = useState(defaultMeasurements);
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
        router.refresh();
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
    setIsSaving(false);
  };

  const handleUpdateMeasurements = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ measurements }),
      });
      if (res.ok) {
        toast.success('Measurements saved!');
        router.refresh();
      } else {
        toast.error('Failed to save measurements');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
    setIsSaving(false);
  };

  const NavButton = ({ tab, label }: { tab: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      style={{ 
        background: 'none', border: 'none', padding: '12px 0', fontSize: '1.1rem', cursor: 'pointer',
        fontWeight: activeTab === tab ? 700 : 400,
        color: activeTab === tab ? 'var(--gold)' : 'inherit',
        textAlign: 'left', width: '100%',
        borderBottom: activeTab === tab ? '2px solid var(--gold)' : '1px solid transparent'
      }}
    >
      {label}
    </button>
  );

  return (
    <div className="container" style={{ margin: '40px auto', padding: '0 20px', minHeight: '60vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: '2.5rem', color: 'var(--wine-deep)' }}>My Account</h1>
        <button onClick={handleLogout} className="btn" style={{ padding: '10px 20px', border: '1px solid rgba(59,18,32,0.2)' }}>
          Log Out
        </button>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Sidebar Nav */}
        <div style={{ flex: '0 0 250px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <li><NavButton tab="profile" label="Profile Details" /></li>
            <li><NavButton tab="measurements" label="My Measurements" /></li>
            <li><NavButton tab="addresses" label="Address Book" /></li>
            <li><NavButton tab="wishlist" label="My Wishlist" /></li>
            <li><NavButton tab="orders" label="Order History" /></li>
          </ul>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontFamily: 'Fraunces, serif', margin: 0 }}>Profile Details</h2>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontWeight: 600 }}>
                    Edit Profile
                  </button>
                )}
              </div>
              
              <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', border: '1px solid rgba(59,18,32,0.1)' }}>
                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>First Name</label>
                        <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                      </div>
                      <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Last Name</label>
                        <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} required />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Email (Cannot be changed)</label>
                      <input type="email" value={user.email} disabled style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', background: '#eee' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Phone Number</label>
                      <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                      <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>{isSaving ? 'Saving...' : 'Save Changes'}</button>
                      <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary" style={{ flex: 1, padding: '10px' }}>Cancel</button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p style={{ marginBottom: '10px' }}><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                    <p style={{ marginBottom: '10px' }}><strong>Email:</strong> {user.email}</p>
                    <p style={{ marginBottom: '10px' }}><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                    <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
                      Member since {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* MEASUREMENTS TAB */}
          {activeTab === 'measurements' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', marginBottom: '10px' }}>My Tailoring Profile</h2>
              <p style={{ color: '#666', marginBottom: '20px' }}>Save your exact measurements for a flawless bespoke fit every time you order.</p>
              
              <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid var(--gold)', boxShadow: '0 4px 20px rgba(201,162,39,0.1)' }}>
                <form onSubmit={handleUpdateMeasurements}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                    
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Chest (inches)</label>
                      <input type="number" step="0.5" value={measurements.chest} onChange={e => setMeasurements({...measurements, chest: e.target.value})} placeholder="e.g. 42" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Waist (inches)</label>
                      <input type="number" step="0.5" value={measurements.waist} onChange={e => setMeasurements({...measurements, waist: e.target.value})} placeholder="e.g. 34" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Shoulder (inches)</label>
                      <input type="number" step="0.5" value={measurements.shoulder} onChange={e => setMeasurements({...measurements, shoulder: e.target.value})} placeholder="e.g. 18.5" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Hip (inches)</label>
                      <input type="number" step="0.5" value={measurements.hip} onChange={e => setMeasurements({...measurements, hip: e.target.value})} placeholder="e.g. 40" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Trouser Length (inches)</label>
                      <input type="number" step="0.5" value={measurements.trouserLength} onChange={e => setMeasurements({...measurements, trouserLength: e.target.value})} placeholder="e.g. 41" style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }} />
                    </div>
                    
                  </div>
                  <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}>
                    {isSaving ? 'Saving...' : 'Save My Measurements'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ADDRESS BOOK TAB */}
          {activeTab === 'addresses' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', marginBottom: '20px' }}>Address Book</h2>
              <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', border: '1px solid rgba(59,18,32,0.1)' }}>
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Default Shipping Address</label>
                    <textarea 
                      rows={3} 
                      value={formData.shippingAddress} 
                      onChange={e => setFormData({...formData, shippingAddress: e.target.value})} 
                      placeholder="Enter your full delivery address..."
                      style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Default Billing Address</label>
                    <textarea 
                      rows={3} 
                      value={formData.billingAddress} 
                      onChange={e => setFormData({...formData, billingAddress: e.target.value})} 
                      placeholder="Enter your billing address (or leave blank if same as shipping)..."
                      style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }} 
                    />
                  </div>
                  <button type="submit" disabled={isSaving} className="btn btn-primary" style={{ padding: '12px' }}>
                    {isSaving ? 'Saving...' : 'Save Addresses'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* WISHLIST TAB */}
          {activeTab === 'wishlist' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', marginBottom: '20px' }}>My Wishlist</h2>
              {(!user.wishlist || user.wishlist.length === 0) ? (
                <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px' }}>
                  <p style={{ color: '#666', marginBottom: '20px' }}>Your wishlist is currently empty.</p>
                  <Link href="/shop" className="btn btn-primary" style={{ padding: '10px 20px', display: 'inline-block' }}>Explore Shop</Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
                  {user.wishlist.map((item: any) => (
                    <div key={item.id} style={{ border: '1px solid #eee', borderRadius: '8px', overflow: 'hidden' }}>
                      <Link href={`/product/${item.product.slug}`} style={{ display: 'block', position: 'relative', height: '250px' }}>
                        <Image src={item.product.images[0]} alt={item.product.name} fill style={{ objectFit: 'cover' }} />
                      </Link>
                      <div style={{ padding: '15px' }}>
                        <h3 style={{ fontSize: '1rem', margin: '0 0 10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          <Link href={`/product/${item.product.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>{item.product.name}</Link>
                        </h3>
                        {item.size && <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 10px' }}>Size: {item.size}</p>}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 600, color: 'var(--wine)' }}>₦{(item.product.salePrice || item.product.rentPrice).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div style={{ animation: 'fadeIn 0.3s' }}>
              <h2 style={{ fontFamily: 'Fraunces, serif', marginBottom: '20px' }}>Order History</h2>
              {user.orders.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px' }}>
                  <p style={{ color: '#666', marginBottom: '20px' }}>You haven't placed any orders yet.</p>
                  <Link href="/shop" className="btn btn-primary" style={{ padding: '10px 20px', display: 'inline-block' }}>Start Shopping</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {user.orders.map((order: any) => {
                    let itemsList = [];
                    try {
                      itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                    } catch(e) {}
                    
                    return (
                      <div key={order.id} style={{ border: '1px solid rgba(59,18,32,0.1)', borderRadius: '8px', padding: '20px', background: '#fff' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(59,18,32,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
                          <div>
                            <strong style={{ display: 'block', fontSize: '0.9rem', color: '#666' }}>Order Date</strong>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <strong style={{ display: 'block', fontSize: '0.9rem', color: '#666' }}>Status</strong>
                            <span style={{ 
                              color: order.status.toLowerCase() === 'delivered' ? 'green' : 
                                     order.status.toLowerCase() === 'cancelled' ? 'red' : 'var(--gold)',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              fontSize: '0.9rem'
                            }}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <ul style={{ paddingLeft: '20px', margin: 0, color: '#444' }}>
                            {itemsList.map((item: any, idx: number) => (
                              <li key={idx} style={{ marginBottom: '5px' }}>
                                <strong>{item.quantity}x</strong> {item.name} {item.mode === 'rent' ? '(Rent)' : ''} {item.size ? `- Size: ${item.size}` : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1.2rem', textAlign: 'right', color: 'var(--wine-deep)' }}>
                          Total: ₦{order.totalAmount.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
