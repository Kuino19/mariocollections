import CartClient from "@/components/CartClient";

export default function CartPage() {
  return (
    <main className="container" style={{ minHeight: '80vh' }}>
      <div className="section-head left">
        <div>
          <div className="eyebrow">Your Bag</div>
          <h2>Shopping Cart</h2>
        </div>
      </div>
      <CartClient />
    </main>
  );
}
