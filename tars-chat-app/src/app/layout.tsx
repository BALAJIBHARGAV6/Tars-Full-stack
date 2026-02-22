/* ========================================================
   ROOT LAYOUT - The Top-Level App Shell
   
   This is the root layout that wraps EVERY page. It:
   1. Imports Google Fonts (DM Sans for body, Playfair Display for display)
   2. Wraps everything with ConvexClientProvider for backend access
   3. Wraps with TooltipProvider for shadcn tooltips
   4. Adds the Toaster for notification toasts
   ======================================================== */

import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

// DM Sans - clean, modern body text
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Playfair Display - elegant serif for display headings
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-display",
});

// Metadata for SEO
export const metadata: Metadata = {
  title: "Tars Chat - Real-time Messaging",
  description:
    "A modern real-time chat application built with Next.js, Convex, and Clerk",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        <ThemeProvider>
          <ConvexClientProvider>
            <TooltipProvider delayDuration={300}>
              {children}
              <Toaster position="top-right" richColors />
            </TooltipProvider>
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
