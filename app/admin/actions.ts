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
