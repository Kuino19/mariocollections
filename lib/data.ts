export type ProductMode = "sale" | "rent" | "both";

export type ProductCategory =
  | "suits"
  | "gowns"
  | "male-traditional"
  | "female-traditional"
  | "shoes"
  | "fans"
  | "souvenirs";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  mode: ProductMode;
  salePrice?: number;
  rentPrice?: number;
  rentDeposit?: number;
  images: string[];
  sizes?: string[];
  description: string;
  inStock: boolean;
}

export type ServiceType = "equipment-rental" | "photoshoot";

export interface StudioService {
  id: string;
  type: ServiceType;
  name: string;
  price: number;
  priceUnit: "per-hour" | "per-session" | "per-day";
  images: string[];
  description: string;
}

import rawProducts from './products.json';

// Flat JSON Data mapped from organized/products.json
export const products: Product[] = rawProducts.map((p: any) => ({
  id: p.slug, // Use slug as the ID for prettier URLs
  name: p.name,
  category: p.category as ProductCategory || 'gowns', // fallback for null categories
  mode: p.mode as ProductMode,
  salePrice: p.salePrice || undefined,
  rentPrice: p.rentPrice || undefined,
  rentDeposit: p.rentPrice ? Math.floor(p.rentPrice * 0.5) : undefined, // Auto-calculate a 50% deposit for rentals
  images: (p.images || []).map((img: string) => `/products/${img}`), // Prefix with /products/
  sizes: p.sizes || undefined,
  description: p.note || p.name, // Use note as description if available
  inStock: true,
}));

export const studioServices: StudioService[] = [
  {
    id: "studio-space-booking",
    type: "photoshoot",
    name: "Studio Space Booking",
    price: 15000,
    priceUnit: "per-hour",
    images: ["/products/services/studio-space.jpeg"], // placeholder
    description: "Book our studio space for shoots, fittings and content sessions.",
  },
  {
    id: "equip-lighting",
    type: "equipment-rental",
    name: "Pro Lighting Kit",
    price: 20000,
    priceUnit: "per-day",
    images: ["/products/services/lighting-kit.jpeg"], // placeholder
    description: "Professional studio lighting kit available to rent by the day.",
  },
  {
    id: "photoshoot-full",
    type: "photoshoot",
    name: "Full Styling Photoshoot",
    price: 150000,
    priceUnit: "per-session",
    images: ["/products/services/full-shoot.jpeg"], // placeholder
    description: "Full styling-to-shutter package, outfit included on request.",
  },
];

// Helper functions
export function getProductsByCategory(category: ProductCategory) {
  return products.filter((p) => p.category === category);
}

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function getServiceById(id: string) {
  return studioServices.find((s) => s.id === id);
}

export function getServicesByType(type: ServiceType) {
  return studioServices.filter((s) => s.type === type);
}
