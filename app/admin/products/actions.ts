'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using the CLOUDINARY_URL environment variable
cloudinary.config({
  secure: true
});

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  });
  revalidatePath('/admin');
  revalidatePath('/shop');
}

export async function saveProduct(formData: FormData, productId?: string) {
  const name = formData.get('name') as string;
  const category = formData.get('category') as string;
  const mode = formData.get('mode') as string;
  const salePrice = parseInt(formData.get('salePrice') as string) || null;
  const rentPrice = parseInt(formData.get('rentPrice') as string) || null;
  const rentDeposit = parseInt(formData.get('rentDeposit') as string) || null;
  const description = formData.get('description') as string || '';
  const measurements = formData.get('measurements') as string || null;
  const accessories = formData.get('accessories') as string || null;
  const inStock = formData.get('inStock') === 'true';
  const sizesRaw = formData.get('sizes') as string;
  const sizes = sizesRaw ? sizesRaw.split(',').map(s => s.trim()) : [];

  // Generate slug
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

  let images: string[] = [];

  // Handle existing images for edits
  const existingImagesRaw = formData.getAll('existingImages');
  if (existingImagesRaw.length > 0) {
    images = [...existingImagesRaw] as string[];
  }

  // Handle new file uploads
  const imageFiles = formData.getAll('images') as File[];
  
  for (const file of imageFiles) {
    if (file.size > 0 && file.type.startsWith('image/')) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Upload to Cloudinary using a promise wrapper
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'mariocollections', public_id: `${slug}-${Date.now()}` },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      }) as any;

      images.push(uploadResult.secure_url);
    }
  }

  if (images.length === 0 && !productId) {
    throw new Error('At least one image is required for new products.');
  }

  const data = {
    name,
    slug: productId ? undefined : slug, // Don't update slug if editing to prevent broken links
    category,
    mode,
    salePrice,
    rentPrice,
    rentDeposit,
    description,
    measurements,
    accessories,
    inStock,
    sizes,
    images,
  };

  if (productId) {
    await prisma.product.update({
      where: { id: productId },
      data
    });
  } else {
    // Check if slug exists
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      data.slug = `${slug}-${Date.now()}`;
    }
    
    await prisma.product.create({
      data: data as any
    });
  }

  revalidatePath('/admin');
  revalidatePath('/shop');
  redirect('/admin');
}
