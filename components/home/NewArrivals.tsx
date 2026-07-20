import { getProducts } from '@/lib/data';
import NewArrivalsClient from './NewArrivalsClient';
import WishlistButton from '../WishlistButton';

export default async function NewArrivals() {
  const products = await getProducts();
  
  // Pull the first 6 products that are in stock
  const arrivals = products.filter(p => p.inStock).slice(0, 6).map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.salePrice || p.rentPrice || 0,
    image: p.images && p.images.length > 0 ? p.images[0] : '/logo.png',
    category: p.category,
    product: p
  }));

  return <NewArrivalsClient arrivals={arrivals} />;
}
