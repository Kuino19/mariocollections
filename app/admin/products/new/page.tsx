import ProductForm from '../ProductForm';
import Link from 'next/link';

export default function NewProductPage() {
  return (
    <div className="container" style={{ padding: '40px 6vw' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link href="/admin" style={{ color: 'var(--gold)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span>&larr;</span> Back to Dashboard
        </Link>
      </div>
      
      <div className="section-head left">
        <div>
          <div className="eyebrow" style={{ marginBottom: '12px' }}>Inventory Management</div>
          <h2>Add New Product</h2>
        </div>
      </div>

      <ProductForm />
    </div>
  );
}
