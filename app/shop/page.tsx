import { products } from "@/lib/data";
import CategoryGrid from "@/components/CategoryGrid";

export default function ShopPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const q = searchParams?.q;
  const searchQuery = Array.isArray(q) ? q[0] : q;

  return (
    <main className="container" style={{ minHeight: '80vh' }}>
      <div className="section-head">
        <div className="eyebrow">All Products</div>
        <h2>The Shop</h2>
      </div>

      <CategoryGrid initialMode="sale" products={products} searchQuery={searchQuery} />
    </main>
  );
}
