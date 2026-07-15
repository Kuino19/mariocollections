import { products } from "@/lib/data";
import CategoryGrid from "@/components/CategoryGrid";

export default function ShopPage() {
  // Sort or filter if needed, but for now just pass all products
  return (
    <main className="container" style={{ minHeight: '80vh' }}>
      <div className="section-head">
        <div className="eyebrow">All Products</div>
        <h2>The Shop</h2>
      </div>

      <CategoryGrid initialMode="sale" products={products} />
    </main>
  );
}
