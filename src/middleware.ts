import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Protected routes configuration
export const config = {
  matcher: [
    '/learning/:path*',
    '/onboarding/:path*',
    // Exclude auth-related paths
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ]
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value
  const isAuthPage = pathname.startsWith('/auth')

  // If user is authenticated and tries to access auth pages, redirect to home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If user is not authenticated and tries to access protected routes
  if (!token && !isAuthPage) {
    const loginUrl = new URL('/auth', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}