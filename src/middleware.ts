import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get('authToken')?.value;

  // Only admin/staff routes require authentication
  const protectedRoutes = ['/admin', '/dashboard', '/manage'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // All other routes are public (variable removed as it's not used)

  // If user is not authenticated and trying to access protected route
  if (!authToken && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and trying to access login page, redirect to home
  if (authToken && pathname === '/login') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};