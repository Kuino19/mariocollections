import { getProductById } from "@/lib/data";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="container" style={{ minHeight: '80vh' }}>
      <ProductDetailClient product={product} />
    </main>
  );
}
