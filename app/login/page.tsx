'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to log in');
      }

      toast.success('Welcome back!');
      router.push('/account');
      router.refresh(); // Refresh to update header state
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', margin: '80px auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontFamily: 'Fraunces, serif' }}>Log In</h1>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', border: '1px solid rgba(59,18,32,0.2)', borderRadius: '3px' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', padding: '12px', border: '1px solid rgba(59,18,32,0.2)', borderRadius: '3px' }}
          />
        </div>
        <button type="submit" className="btn btn-gold" disabled={loading} style={{ padding: '16px', marginTop: '10px' }}>
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Don't have an account? <Link href="/register" style={{ color: 'var(--gold)', fontWeight: 600 }}>Sign up</Link></p>
      </div>
    </div>
  );
}
