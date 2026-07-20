import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const user = await getSession() as { id: string } | null;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlistItem.findMany({
      where: { userId: user.id },
      include: { product: true }
    });

    const formattedItems = wishlistItems.map(item => ({
      id: item.product.id,
      name: item.product.name,
      price: item.product.salePrice || item.product.rentPrice || 0,
      image: item.product.images[0],
      slug: item.product.slug,
      category: item.product.category,
      size: item.size
    }));

    return NextResponse.json(formattedItems);
  } catch (error) {
    console.error("GET Wishlist Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSession() as { id: string } | null;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Handle bulk sync
    if (body.items && Array.isArray(body.items)) {
      const { items } = body;
      
      for (const item of items) {
        // Upsert to ignore duplicates
        await prisma.wishlistItem.upsert({
          where: {
            userId_productId_size: {
              userId: user.id,
              productId: item.id,
              size: item.size || ""
            }
          },
          update: {}, // Do nothing if it exists
          create: {
            userId: user.id,
            productId: item.id,
            size: item.size || ""
          }
        });
      }
      
      return NextResponse.json({ success: true });
    }

    // Handle single item add
    const { productId, size } = body;
    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    await prisma.wishlistItem.upsert({
      where: {
        userId_productId_size: {
          userId: user.id,
          productId,
          size: size || ""
        }
      },
      update: {},
      create: {
        userId: user.id,
        productId,
        size: size || ""
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST Wishlist Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getSession() as { id: string } | null;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const size = searchParams.get('size') || "";

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }

    await prisma.wishlistItem.deleteMany({
      where: {
        userId: user.id,
        productId,
        size
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Wishlist Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
