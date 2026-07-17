import { getProducts } from '@/lib/data';
import NewArrivalsClient from './NewArrivalsClient';

export default async function NewArrivals() {
  const products = await getProducts();
  
  // Pull the first 6 products that are in stock
  const arrivals = products.filter(p => p.inStock).slice(0, 6).map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.salePrice || p.rentPrice || 0,
    image: p.images[0],
    category: p.category
  }));

  return <NewArrivalsClient arrivals={arrivals} />;
}
