'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// We are using a hardcoded password for now as requested.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mario123'

export async function login(formData: FormData) {
  const password = formData.get('password')

  if (password === ADMIN_PASSWORD) {
    // Set a cookie that the middleware will check
    const cookieStore = await cookies()
    cookieStore.set('admin-auth', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    })
    
    redirect('/admin')
  } else {
    return { error: 'Invalid password' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('admin-auth')
  redirect('/admin/login')
}

// Order Management Actions
export async function updateOrderStatus(orderId: string, status: string) {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin-auth')
  if (!auth) throw new Error("Unauthorized")

  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to update order:", error)
    return { error: "Failed to update order" }
  }
}

// Review Management Actions
export async function deleteReview(reviewId: string) {
  const cookieStore = await cookies()
  const auth = cookieStore.get('admin-auth')
  if (!auth) throw new Error("Unauthorized")

  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()

  try {
    await prisma.review.delete({
      where: { id: reviewId }
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to delete review:", error)
    return { error: "Failed to delete review" }
  }
}
