import { getProductById, getProductsByCategory } from "@/lib/data";
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/ProductDetailClient";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images ? [{ url: product.images[0] }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.images ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  // Get related products from the same category
  const relatedProducts = (await getProductsByCategory(product.category))
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  return (
    <main className="container" style={{ minHeight: '80vh' }}>
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </main>
  );
}
