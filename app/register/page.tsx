'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, phone })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register');
      }

      toast.success('Account created successfully!');
      router.push('/account');
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', margin: '60px auto', padding: '0 20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px', fontFamily: 'Fraunces, serif' }}>Create an Account</h1>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>First Name</label>
            <input 
              type="text" 
              value={firstName} 
              onChange={e => setFirstName(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid rgba(59,18,32,0.2)', borderRadius: '3px' }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Last Name</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={e => setLastName(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', border: '1px solid rgba(59,18,32,0.2)', borderRadius: '3px' }}
            />
          </div>
        </div>
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
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Phone Number</label>
          <input 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
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
            minLength={6}
            style={{ width: '100%', padding: '12px', border: '1px solid rgba(59,18,32,0.2)', borderRadius: '3px' }}
          />
        </div>
        <button type="submit" className="btn btn-gold" disabled={loading} style={{ padding: '16px', marginTop: '10px' }}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <p>Already have an account? <Link href="/login" style={{ color: 'var(--gold)', fontWeight: 600 }}>Log in</Link></p>
      </div>
    </div>
  );
}
