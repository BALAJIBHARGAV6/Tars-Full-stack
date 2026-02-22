/* ========================================================
   MAIN LAYOUT - Sidebar + Content Area
   
   Two-panel design:
   - Left: Conversation sidebar (HIDDEN on home/interaction page)
   - Right: Main content
   
   On home page (/): Full-screen interaction page, no sidebar
   On chat pages: Sidebar + chat view
   ======================================================== */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, MessageCircle, Sparkles } from "lucide-react";
import ConversationList from "@/components/conversations/ConversationList";
import UserSyncProvider from "@/components/providers/UserSyncProvider";
import NetworkStatus from "@/components/shared/NetworkStatus";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { useSidebarStore } from "@/lib/store";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { UserButton } from "@clerk/nextjs";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const pathname = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { isOpen, close, toggle } = useSidebarStore();

  // Home page = interaction page, no sidebar
  const isHomePage = pathname === "/";

  // Get total unread count for browser tab title
  const totalUnread = useQuery(
    api.unread.getTotalUnread,
    user ? { userId: user.id } : "skip"
  );

  useEffect(() => {
    if (totalUnread && totalUnread > 0) {
      document.title = `(${totalUnread}) Tars Chat`;
    } else {
      document.title = "Tars Chat";
    }
  }, [totalUnread]);

  useEffect(() => {
    if (isDesktop) close();
  }, [isDesktop, close]);

  // ===== HOME / INTERACTION PAGE: Full-screen, no sidebar =====
  if (isHomePage) {
    return (
      <UserSyncProvider>
        <div className="flex h-dvh flex-col overflow-hidden gradient-bg-hero">
          <NetworkStatus />
          {/* Full-screen content — page.tsx handles its own navbar */}
          <main className="flex flex-1 flex-col overflow-hidden">
            {children}
          </main>
        </div>
      </UserSyncProvider>
    );
  }

  // ===== CHAT PAGES: Sidebar + content =====
  return (
    <UserSyncProvider>
      <div className="flex h-dvh flex-col overflow-hidden gradient-bg-hero">
        <NetworkStatus />

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop sidebar */}
          <aside className="hidden md:flex md:w-80 lg:w-96 flex-col border-r border-slate-200/60 dark:border-slate-700/60 sidebar-gradient">
            {/* Sidebar Header */}
            <div className="relative border-b border-slate-200/60 dark:border-slate-700/60 px-5 py-4 overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-25"
                style={{
                  background: "linear-gradient(135deg, rgba(168,85,247,0.06) 0%, rgba(52,211,153,0.04) 50%, transparent 100%)",
                }}
              />
              <div className="absolute inset-0 pointer-events-none glass" />
              <div className="relative z-10 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 group">
                  <div className="relative">
                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-green-400 opacity-60 blur-sm group-hover:opacity-80 transition-opacity" />
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-green-400 shadow-lg shadow-violet-500/25 transition-transform group-hover:scale-105">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <span className="font-display text-lg font-bold gradient-text group-hover:opacity-80 transition-opacity block leading-tight">
                      Tars Chat
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                      <Sparkles className="h-2.5 w-2.5" />
                      Messaging Platform
                    </span>
                  </div>
                </Link>
                <div className="flex items-center gap-1.5">
                  <ThemeToggle />
                  <UserButton
                    afterSignOutUrl="/sign-in"
                    appearance={{
                      elements: {
                        avatarBox: "h-9 w-9 ring-2 ring-violet-100 dark:ring-violet-900",
                      },
                    }}
                  />
                </div>
              </div>
            </div>

            <ConversationList />

            {/* Sidebar Footer */}
            <div className="border-t border-slate-200/60 dark:border-slate-700/60 px-5 py-3">
              <div className="flex items-center justify-between">
                <p className="text-[10px] text-slate-300 dark:text-slate-600 tracking-wider uppercase font-medium">
                  Developed by Tars
                </p>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    Live
                  </span>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
          <AnimatePresence>
            {isOpen && !isDesktop && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={close}
                  className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm"
                />
                <motion.aside
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  className="fixed inset-y-0 left-0 z-50 flex w-80 flex-col sidebar-gradient shadow-2xl shadow-violet-500/10"
                >
                  <div className="relative border-b border-slate-200/60 dark:border-slate-700/60 px-5 py-4 overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none glass" />
                    <div className="relative z-10 flex items-center justify-between">
                      <Link href="/" onClick={close} className="flex items-center gap-3 group">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-green-400 shadow-lg shadow-violet-500/25">
                          <MessageCircle className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-display text-lg font-bold gradient-text">
                          Tars Chat
                        </span>
                      </Link>
                      <div className="flex items-center gap-1.5">
                        <ThemeToggle />
                        <button
                          onClick={close}
                          className="rounded-xl p-2 text-slate-400 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <ConversationList />
                  <div className="border-t border-slate-200/60 dark:border-slate-700/60 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <UserButton afterSignOutUrl="/sign-in" appearance={{ elements: { avatarBox: "h-9 w-9 ring-2 ring-violet-100 dark:ring-violet-900" } }} />
                      <div className="flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Live</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-300 dark:text-slate-600 tracking-wider uppercase font-medium text-center">
                      Developed by Tars
                    </p>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main content */}
          <main className="flex flex-1 flex-col overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
            {/* Mobile header */}
            <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-700/60 px-4 py-3 md:hidden glass">
              <div className="flex items-center gap-3">
                <button
                  onClick={toggle}
                  className="rounded-xl p-2 text-slate-600 dark:text-slate-300 hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-green-400 shadow-md shadow-violet-500/20">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-display text-lg font-bold gradient-text">
                    Tars Chat
                  </span>
                </Link>
              </div>
              <ThemeToggle />
            </div>
            {children}
          </main>
        </div>
      </div>
    </UserSyncProvider>
  );
}
