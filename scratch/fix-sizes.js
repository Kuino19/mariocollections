require('dotenv').config();
process.env.DATABASE_URL = process.env.DIRECT_URL;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  let count = 0;
  for (const p of products) {
    if (!p.sizes || p.sizes.length === 0) {
      const isAccessory = ['accessories', 'fans', 'shoes'].includes(p.category) || p.category.includes('beads');
      const sizesToSet = isAccessory ? ['One Size'] : ['S', 'M', 'L', 'XL', 'XXL'];
      
      await prisma.product.update({
        where: { id: p.id },
        data: { sizes: sizesToSet }
      });
      count++;
    }
  }
  console.log('Updated ' + count + ' products with sizes');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
