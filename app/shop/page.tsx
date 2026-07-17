import { getProducts } from "@/lib/data";
import CategoryGrid from "@/components/CategoryGrid";

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const params = await searchParams;
  const searchQuery = typeof params?.q === 'string' ? params.q : undefined;
  
  const products = await getProducts();

  return (
    <main className="container" style={{ minHeight: '80vh' }}>
      <div className="section-head">
        <div className="eyebrow">All Products</div>
        <h2>The Shop</h2>
      </div>
      
      <CategoryGrid initialMode="sale" products={products as any} searchQuery={searchQuery} />
    </main>
  );
}
