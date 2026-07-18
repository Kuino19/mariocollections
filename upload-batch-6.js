const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');

// Configure Cloudinary
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL
});

const prisma = new PrismaClient();

const BATCH_DIR = path.join(__dirname, 'organized6');
const BATCH_JSON = path.join(BATCH_DIR, 'products-batch3-final.json');

async function uploadBatch() {
  try {
    const rawData = fs.readFileSync(BATCH_JSON, 'utf8');
    const products = JSON.parse(rawData);

    for (const prod of products) {
      console.log(`Processing ${prod.name}...`);

      const uploadedImages = [];
      
      // Upload images to Cloudinary
      for (const imgPath of prod.images) {
        // The json images array probably contains "slug/image.jpg"
        // Let's ensure it maps correctly to the organized6 folder
        const fullLocalPath = path.join(BATCH_DIR, imgPath);
        if (fs.existsSync(fullLocalPath)) {
          console.log(`  Uploading ${imgPath}...`);
          try {
            const result = await cloudinary.uploader.upload(fullLocalPath, {
              folder: 'mariocollections/products'
            });
            uploadedImages.push(result.secure_url);
            console.log(`  -> Uploaded: ${result.secure_url}`);
          } catch (uploadErr) {
            console.error(`  -> Failed to upload ${imgPath}:`, uploadErr);
          }
        } else {
          console.warn(`  ! File not found: ${fullLocalPath}`);
        }
      }

      // Ensure proper category fallback
      const category = prod.category || 'accessories';

      // Check if product already exists
      const existing = await prisma.product.findUnique({
        where: { slug: prod.slug }
      });

      if (existing) {
        console.log(`  Updating existing product: ${prod.slug}`);
        await prisma.product.update({
          where: { slug: prod.slug },
          data: {
            name: prod.name,
            category: category,
            mode: prod.mode || 'both',
            salePrice: prod.salePrice || null,
            rentPrice: prod.rentPrice || null,
            description: prod.description || `Beautiful ${prod.name.toLowerCase()} available for your events.`,
            images: uploadedImages.length > 0 ? uploadedImages : undefined,
          }
        });
      } else {
        console.log(`  Creating new product: ${prod.slug}`);
        await prisma.product.create({
          data: {
            slug: prod.slug,
            name: prod.name,
            category: category,
            mode: prod.mode || 'both',
            salePrice: prod.salePrice || null,
            rentPrice: prod.rentPrice || null,
            description: prod.description || `Beautiful ${prod.name.toLowerCase()} available for your events.`,
            images: uploadedImages,
            sizes: ['One Size'] // Generic fallback
          }
        });
      }
    }

    console.log('\nBatch 6 upload complete!');
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

uploadBatch();
