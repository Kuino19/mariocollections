import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

// Manually parse CLOUDINARY_URL to ensure Webpack/Vercel correctly initializes the SDK
const cloudinaryUrl = process.env.CLOUDINARY_URL || '';
if (cloudinaryUrl.startsWith('cloudinary://')) {
  const parts = cloudinaryUrl.replace('cloudinary://', '').split('@');
  if (parts.length === 2) {
    const keys = parts[0].split(':');
    if (keys.length === 2) {
      cloudinary.config({
        cloud_name: parts[1],
        api_key: keys[0],
        api_secret: keys[1],
        secure: true
      });
    }
  }
} else {
  cloudinary.config({ secure: true });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const productId = formData.get('productId') as string;
    const authorName = formData.get('authorName') as string;
    const rating = parseInt(formData.get('rating') as string, 10);
    const comment = formData.get('comment') as string;
    const imageFiles = formData.getAll('images') as File[];

    if (!productId || !authorName || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const uploadedImageUrls: string[] = [];

    // Upload images to Cloudinary
    for (const file of imageFiles) {
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        const uploadResult = await new Promise<any>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'mariocollections/reviews' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(buffer);
        });

        uploadedImageUrls.push(uploadResult.secure_url);
      }
    }

    // Save to Database
    const review = await prisma.review.create({
      data: {
        productId,
        authorName,
        rating,
        comment,
        images: uploadedImageUrls,
      }
    });

    return NextResponse.json({ success: true, review });

  } catch (error: any) {
    console.error('Review submission error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit review' }, { status: 500 });
  }
}
