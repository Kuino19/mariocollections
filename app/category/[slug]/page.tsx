import { getProductsByCategory, ProductCategory } from "@/lib/data";
import CategoryGrid from "@/components/CategoryGrid";

export default async function CategoryPage({ params, searchParams }: { params: { slug: string }, searchParams: { mode?: string } }) {
  const { slug } = await params;
  const sParams = await searchParams;
  const initialMode = (sParams.mode === 'rent' || sParams.mode === 'sale') ? sParams.mode : 'sale';
  
  const products = await getProductsByCategory(slug as ProductCategory);

  const categoryName = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <main className="container" style={{ minHeight: '80vh' }}>
      <div className="section-head">
        <div className="eyebrow">Category</div>
        <h2>{categoryName}</h2>
      </div>

      <CategoryGrid initialMode={initialMode} products={products} />
    </main>
  );
}
