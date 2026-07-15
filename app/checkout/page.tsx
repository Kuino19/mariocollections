import CheckoutClient from "@/components/CheckoutClient";

export default function CheckoutPage() {
  return (
    <main className="container" style={{ minHeight: '80vh' }}>
      <div className="section-head left">
        <div>
          <div className="eyebrow">Secure Checkout</div>
          <h2>Complete your order</h2>
        </div>
      </div>
      <CheckoutClient />
    </main>
  );
}
