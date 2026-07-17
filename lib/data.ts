import prisma from "./prisma";
import type { Product } from "@prisma/client";
export type { Product };

export type ProductMode = "sale" | "rent" | "both";

export type ProductCategory =
  | "suits"
  | "gowns"
  | "male-traditional"
  | "female-traditional"
  | "shoes"
  | "fans"
  | "souvenirs";

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

// Helper functions that now talk to Prisma
export async function getProducts() {
  return await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function getProductsByCategory(category: ProductCategory | string) {
  return await prisma.product.findMany({
    where: { category }
  });
}

export async function getProductById(idOrSlug: string) {
  return await prisma.product.findFirst({
    where: {
      OR: [
        { id: idOrSlug },
        { slug: idOrSlug }
      ]
    }
  });
}

export function getServiceById(id: string) {
  return studioServices.find((s) => s.id === id);
}

export function getServicesByType(type: ServiceType) {
  return studioServices.filter((s) => s.type === type);
}
