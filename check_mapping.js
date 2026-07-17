const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const p = await prisma.product.findMany({ take: 10 });
  p.forEach(product => {
    console.log(`Name: ${product.name}`);
    console.log(`Image: ${product.images[0]}`);
    console.log('---');
  });
  await prisma.$disconnect();
}

check();
