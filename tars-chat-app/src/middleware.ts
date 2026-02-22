/* ========================================================
   CLERK MIDDLEWARE - Route Protection
   
   This middleware runs on EVERY request before it reaches
   your page. It checks if the user is authenticated and:
   - Allows access to public routes (sign-in, sign-up, webhooks)
   - Redirects unauthenticated users to /sign-in for protected routes
   
   The clerkMiddleware function handles all the JWT token
   verification automatically.
   ======================================================== */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define which routes are PUBLIC (accessible without login)
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",   // Sign in page and all its sub-routes
  "/sign-up(.*)",   // Sign up page and all its sub-routes
  "/api/webhooks(.*)", // Webhook endpoints (called by Clerk servers)
]);

export default clerkMiddleware(async (auth, req) => {
  // If the route is NOT public, require authentication
  if (!isPublicRoute(req)) {
    await auth.protect(); // Redirects to sign-in if not logged in
  }
});

// Tell Next.js which routes this middleware should run on
export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
