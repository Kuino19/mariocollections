'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AccountClient({ user }: { user: any }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  const router = useRouter();

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

  return (
    <div className="container" style={{ margin: '40px auto', padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif' }}>My Account</h1>
        <button onClick={handleLogout} className="btn" style={{ padding: '10px 20px', border: '1px solid rgba(59,18,32,0.2)' }}>
          Log Out
        </button>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
        {/* Sidebar Nav */}
        <div style={{ flex: '0 0 250px' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <button 
                onClick={() => setActiveTab('profile')}
                style={{ 
                  background: 'none', border: 'none', padding: '10px 0', fontSize: '1.1rem', cursor: 'pointer',
                  fontWeight: activeTab === 'profile' ? 700 : 400,
                  color: activeTab === 'profile' ? 'var(--gold)' : 'inherit',
                  textAlign: 'left', width: '100%'
                }}
              >
                Profile Details
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('orders')}
                style={{ 
                  background: 'none', border: 'none', padding: '10px 0', fontSize: '1.1rem', cursor: 'pointer',
                  fontWeight: activeTab === 'orders' ? 700 : 400,
                  color: activeTab === 'orders' ? 'var(--gold)' : 'inherit',
                  textAlign: 'left', width: '100%'
                }}
              >
                Order History
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          {activeTab === 'profile' && (
            <div>
              <h2 style={{ fontFamily: 'Fraunces, serif', marginBottom: '20px' }}>Profile Details</h2>
              <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '5px', border: '1px solid rgba(59,18,32,0.1)' }}>
                <p><strong>First Name:</strong> {user.firstName}</p>
                <p><strong>Last Name:</strong> {user.lastName}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
                <p style={{ marginTop: '20px', fontSize: '0.9rem', color: '#666' }}>
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h2 style={{ fontFamily: 'Fraunces, serif', marginBottom: '20px' }}>Order History</h2>
              {user.orders.length === 0 ? (
                <p>You haven't placed any orders yet.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {user.orders.map((order: any) => {
                    let itemsList = [];
                    try {
                      itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
                    } catch(e) {}
                    
                    return (
                      <div key={order.id} style={{ border: '1px solid rgba(59,18,32,0.1)', borderRadius: '5px', padding: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(59,18,32,0.1)', paddingBottom: '10px', marginBottom: '15px' }}>
                          <div>
                            <strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div>
                            <strong>Status:</strong> <span style={{ color: order.status === 'PAID' ? 'green' : 'var(--gold)' }}>{order.status}</span>
                          </div>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <ul style={{ paddingLeft: '20px', margin: 0 }}>
                            {itemsList.map((item: any, idx: number) => (
                              <li key={idx}>
                                {item.quantity}x {item.name} {item.mode === 'rent' ? '(Rent)' : ''}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '1.1rem', textAlign: 'right' }}>
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
