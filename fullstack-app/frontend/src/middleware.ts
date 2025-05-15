import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the path the user is trying to access
  const path = request.nextUrl.pathname;
  
  // Define public paths that don't require authentication
  const publicPaths = ['/login', '/register'];
  
  // Check if the path is public
  const isPublicPath = publicPaths.includes(path);
  
  // Check if user is logged in by looking for the token cookie or localStorage flag
  // For client-side navigation, we rely on localStorage
  // For initial page load or hard refresh, we check the cookie
  const isLoggedIn = request.cookies.has('token');
  
  // If user is not logged in and trying to access a protected route, redirect to login
  if (!isLoggedIn && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If user is logged in and trying to access login or register, redirect to home
  if (isLoggedIn && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Otherwise, continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
