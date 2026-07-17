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
  revalidatePath('/', 'layout');
}

export async function saveProduct(formData: FormData, productId?: string) {
  try {
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

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    let images: string[] = [];

    const existingImagesRaw = formData.getAll('existingImages');
    if (existingImagesRaw.length > 0) {
      images = [...existingImagesRaw] as string[];
    }

    const imageFiles = formData.getAll('images') as File[];
    
    for (const file of imageFiles) {
      if (file.size > 0 && file.type.startsWith('image/')) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        try {
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
        } catch (uploadError: any) {
          console.error("Cloudinary Upload Error:", uploadError);
          return { success: false, error: "Cloudinary configuration error: " + (uploadError?.message || JSON.stringify(uploadError)) };
        }
      }
    }

    if (images.length === 0 && !productId) {
      return { success: false, error: 'At least one valid image is required for new products.' };
    }

    const data = {
      name,
      slug: productId ? undefined : slug,
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
      const existing = await prisma.product.findUnique({ where: { slug } });
      if (existing) {
        data.slug = `${slug}-${Date.now()}`;
      }
      await prisma.product.create({
        data: data as any
      });
    }

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (err: any) {
    console.error("Save product error:", err);
    return { success: false, error: err?.message || String(err) };
  }
}
