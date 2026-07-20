import prisma from '@/lib/prisma'
import Link from 'next/link'
import { logout } from './actions'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin Dashboard - Mario Collections',
}

export default async function AdminDashboard() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100 
  });

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: { orders: true }
      }
    }
  });

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: 'desc' },
    include: { product: true }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-[#D4AF37]">Admin Portal</h1>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                href="/" 
                className="text-sm font-medium text-gray-500 hover:text-[#D4AF37] transition-colors"
                target="_blank"
              >
                View Live Site &#8599;
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <AdminDashboardClient initialProducts={products as any} orders={orders as any} users={users as any} reviews={reviews as any} />
      </main>
    </div>
  )
}
