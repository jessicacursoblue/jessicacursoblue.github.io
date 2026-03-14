import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = ['/dashboard', '/api/athletes', '/api/diets', '/api/progress', '/api/billing']
  
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login if accessing protected route without token
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    try {
      // Verify token is valid
      jwt.verify(token, process.env.NEXTAUTH_SECRET!)
    } catch (error) {
      // Token is invalid, redirect to login
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
  }

  // Allow public routes (landing page, auth pages) without token
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png|og-image.png).*)',
  ],
}
