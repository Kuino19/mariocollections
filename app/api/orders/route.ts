import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate request
    if (!data.customerName || !data.customerEmail || !data.totalAmount || !data.items || !data.paymentRef) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save the order to DB
    const order = await prisma.order.create({
      data: {
        userId: data.userId || null,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone || null,
        totalAmount: data.totalAmount,
        status: data.status || 'PENDING',
        paymentRef: data.paymentRef,
        items: data.items, // JSON array of cart items
      }
    });

    return NextResponse.json({ success: true, order });
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
