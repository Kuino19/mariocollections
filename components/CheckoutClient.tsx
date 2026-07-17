'use client';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { useRouter } from 'next/navigation';

export default function CheckoutClient() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <p>Your cart is empty.</p>
        <button className="btn btn-gold" onClick={() => router.push('/shop')}>Go to Shop</button>
      </div>
    );
  }

  const amount = getTotalPrice();

  const handlePaystack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !firstName || !lastName || !phone || !address) {
      alert("Please fill all details including delivery address.");
      return;
    }

    try {
      const PaystackModule = await import('@paystack/inline-js');
      const PaystackPop = PaystackModule.default;
      const paystack = new PaystackPop();
      
      // Pass line items metadata to Paystack so fulfillment knows what to do
      const metadata = {
        custom_fields: [
          {
            display_name: "Cart Items",
            variable_name: "cart_items",
            value: JSON.stringify(items.map(item => ({
              id: item.productId,
              name: item.name,
              mode: item.mode,
              eventDate: item.eventDate,
              returnDate: item.returnDate
            })))
          }
        ]
      };

      paystack.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email,
        amount: amount * 100, // Paystack expects kobo
        firstname: firstName,
        lastname: lastName,
        metadata,
        onSuccess: (transaction: any) => {
          // Construct the receipt message for WhatsApp
          const itemsText = items.map(item => 
            `- ${item.quantity}x ${item.name} (${item.mode.toUpperCase()}) - ₦${((item.price * item.quantity) + (item.rentDeposit ? item.rentDeposit * item.quantity : 0)).toLocaleString()}` + 
            (item.eventDate ? `\n  Event: ${item.eventDate}` : '')
          ).join('\n');

          const receiptMessage = `*New Order Receipt (Paid via Paystack)*\n\n` +
            `*Customer:* ${firstName} ${lastName}\n` +
            `*Email:* ${email}\n` +
            `*Phone:* ${phone}\n` +
            `*Delivery Address:* ${address}\n` +
            `*Reference:* ${transaction.reference}\n\n` +
            `*Items:*\n${itemsText}\n\n` +
            `*Total Paid:* ₦${amount.toLocaleString()}`;

          clearCart();
          
          // Redirect to WhatsApp with the pre-filled message
          const waUrl = `https://wa.me/2348113683580?text=${encodeURIComponent(receiptMessage)}`;
          window.location.href = waUrl;
        },
        onCancel: () => {
          console.log('Payment cancelled');
        }
      });
    } catch (error) {
      console.error("Failed to load Paystack inline script", error);
      alert("There was an error loading the payment gateway. Please try again.");
    }
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
      <div style={{ flex: '1 1 50%' }}>
        <h3 style={{ borderBottom: '2px solid var(--gold)', paddingBottom: '12px', marginBottom: '24px' }}>Customer Details</h3>
        <form onSubmit={handlePaystack} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>First Name</label>
              <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Last Name</label>
              <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Phone Number (WhatsApp)</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 600 }}>Delivery Address</label>
            <textarea 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              required 
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid rgba(59,18,32,0.2)',
                borderRadius: '3px',
                minHeight: '80px',
                fontFamily: 'inherit',
                fontSize: '0.95rem'
              }}
              placeholder="Enter your full delivery address"
            />
          </div>
          
          <button type="submit" className="btn btn-gold" style={{ marginTop: '16px', width: '100%', padding: '18px' }}>
            Pay ₦{amount.toLocaleString()} Now
          </button>
        </form>
      </div>

      <div style={{ flex: '1 1 40%', minWidth: '300px' }}>
        <div style={{ background: '#fff', border: '1px solid rgba(59,18,32,0.1)', padding: '24px', borderRadius: '3px' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Order Summary</h3>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.95rem' }}>
              <span>{item.quantity}x {item.name} {item.mode === 'rent' ? '(Rent)' : ''}</span>
              <span>₦{((item.price * item.quantity) + (item.rentDeposit ? item.rentDeposit * item.quantity : 0)).toLocaleString()}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(59,18,32,0.1)', margin: '16px 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.2rem' }}>
            <span>Total</span>
            <span>₦{amount.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
