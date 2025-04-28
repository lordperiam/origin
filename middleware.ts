import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Export the Clerk middleware with any protected routes
export default clerkMiddleware();

// Configure middleware matcher to run on appropriate routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones we don't want to run middleware on
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Add any other route you want to exclude here
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}; 