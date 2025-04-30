import { clerkMiddleware } from "@clerk/nextjs/server";

// See https://clerk.com/docs/references/nextjs/auth-middleware for more information
export default clerkMiddleware((auth, req) => {
  // Public routes that don't require authentication
  const publicPaths = ["/", "/about", "/contact", "/features", "/pricing", "/api/webhook"];
  const isPublicPath = publicPaths.some(path => req.url.includes(path));

  if (isPublicPath) {
    return;
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};