// proxy.js — Next.js 16 route proxy (replaces middleware.js)
// Runs in Edge Runtime — must NOT import any Node.js modules (fs, crypto, etc.)
// Uses NextAuth JWT directly to check session without touching the database.

import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function proxy(request) {
  const { nextUrl } = request
  const pathname = nextUrl.pathname

  const isAuthPage  = pathname.startsWith('/login')
  const isAdminPage = pathname.startsWith('/admin')
  const isApiAuth   = pathname.startsWith('/api/auth')
  const isStatic    = pathname.startsWith('/_next') || pathname.match(/\.(png|jpg|svg|ico|css|js)$/)

  // Always allow static files and auth API
  if (isStatic || isApiAuth) return NextResponse.next()

  // Read JWT from cookie — edge-safe, no DB call
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const isLoggedIn = !!token
  const isAdmin = token?.role === 'ADMIN'

  // Not logged in → redirect to login
  if (!isLoggedIn) {
    if (isAuthPage) return NextResponse.next()
    const loginUrl = new URL('/login', nextUrl)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Already logged in and on login page → go to dashboard
  if (isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // Admin-only routes → redirect non-admins
  if (isAdminPage && !isAdmin) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  // Root → dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
}
