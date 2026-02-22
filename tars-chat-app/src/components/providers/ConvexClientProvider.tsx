/* ========================================================
   CONVEX CLIENT PROVIDER
   
   This component wraps the entire app to provide Convex
   and Clerk integration. It:
   1. Connects to Convex backend using the URL from env vars
   2. Integrates Clerk auth so Convex knows who's logged in
   3. Provides the ConvexReactClient to all child components
   
   Think of this as the "bridge" between your frontend and
   the Convex real-time backend.
   ======================================================== */

"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Create a single Convex client instance
// NEXT_PUBLIC_ prefix means this variable is available in the browser
const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);

// Provider component that wraps the entire app
export default function ConvexClientProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    // ClerkProvider: Handles authentication (login/signup)
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string}
    >
      {/* ConvexProviderWithClerk: Connects Convex to Clerk
          so that Convex functions can access the authenticated user */}
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
