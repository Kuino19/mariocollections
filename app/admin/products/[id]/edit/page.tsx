import ProductForm from '../../ProductForm';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductById } from '@/lib/data';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

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
          <h2>Edit Product</h2>
        </div>
      </div>

      <ProductForm product={product} />
    </div>
  );
}
