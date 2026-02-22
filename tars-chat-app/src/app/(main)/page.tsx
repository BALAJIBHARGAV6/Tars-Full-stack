/* ========================================================
   HOME PAGE - Optimized Interaction Page
   
   - Lightweight floating navbar
   - Fast hero section without heavy effects
   - Smooth page transitions
   ======================================================== */

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  MessageCircle,
  Users,
  Sparkles,
  ArrowRight,
  Heart,
  Zap,
  Shield,
  Globe,
  Bell,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser, UserButton } from "@clerk/nextjs";
import UserList from "@/components/users/UserList";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

const DotLottieReact = dynamic(
  () =>
    import("@lottiefiles/dotlottie-react").then((mod) => mod.DotLottieReact),
  { ssr: false, loading: () => <div className="w-full h-full bg-violet-100/50 dark:bg-violet-900/20 rounded-full animate-pulse" /> }
);

export default function HomePage() {
  const { user } = useUser();
  const [showUsers, setShowUsers] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalUnread = useQuery(
    api.unread.getTotalUnread,
    user ? { userId: user.id } : "skip"
  );

  // Loading Transition Screen - Messages Typing Style
  if (isTransitioning) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-8">
          {/* Logo */}
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          
          {/* Typing dots animation */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2.5 h-2.5 bg-violet-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
          
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading people...</p>
        </div>
      </div>
    );
  }

  // Discover Users View
  if (showUsers) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Navbar */}
        <div className="sticky top-0 z-50 flex justify-center px-4 py-3">
          <nav className="flex items-center justify-between w-full max-w-2xl rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 px-4 py-2.5">
            <button
              onClick={() => setShowUsers(false)}
              className="flex items-center gap-2.5 pl-1"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold gradient-text">
                Tars
              </span>
            </button>
            <div className="flex items-center gap-2 pr-1">
              <ThemeToggle />
              <UserButton afterSignOutUrl="/sign-in" />
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
            
            {/* Lottie Animation */}
            <div className="w-40 h-40 sm:w-52 sm:h-52 mx-auto mb-4">
              <DotLottieReact
                src="https://lottie.host/59f5c75b-3a65-437e-9bad-1aa8785709b7/1jVgovl86G.lottie"
                loop
                autoplay
                style={{ width: "100%", height: "100%" }}
              />
            </div>

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Discover <span className="gradient-text">People</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Find people and start conversations
              </p>
            </div>

            {/* User List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6">
              <UserList />
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-8 mt-8">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                  <MessageCircle className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-display text-sm font-bold text-slate-800 dark:text-white">
                  Tars
                </span>
              </div>
              <p className="text-xs text-slate-500">© {new Date().getFullYear()} Tars</p>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  // ============= MAIN INTERACTION PAGE =============
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950">
      {/* Navbar */}
      <div className="sticky top-0 z-50 flex justify-center px-4 py-3">
        <nav className="flex items-center justify-between w-full max-w-2xl rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 px-4 py-2.5">
          <Link href="/" className="flex items-center gap-2.5 pl-0.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold gradient-text">
              Tars
            </span>
          </Link>

          <div className="flex items-center gap-2 pr-0.5">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-4 pt-8 pb-16 min-h-[calc(100dvh-72px)]">
        {/* Lottie */}
        <div className="w-56 h-56 sm:w-72 sm:h-72 mb-6">
          <DotLottieReact
            src="https://lottie.host/3aa6ca0a-f9d7-4bf0-88ff-cd7b2dd01b2c/YobNNqyHC5.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Title */}
        <div className="text-center mb-8 px-2">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight">
            <span className="gradient-text">Tars</span> — Where <span className="gradient-text">chats</span>
            <br />
            come <span className="text-emerald-500">alive</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-4">
            The messaging platform built for
            <span className="font-medium text-slate-700 dark:text-slate-300"> speed</span>,
            <span className="font-medium text-slate-700 dark:text-slate-300"> design</span>, and
            <span className="font-medium text-slate-700 dark:text-slate-300"> privacy</span>.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm px-4">
          <button
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setShowUsers(true);
                setIsTransitioning(false);
              }, 600);
            }}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:opacity-90 active:scale-[0.98] transition-all"
          >
            <Users className="h-4 w-4" />
            <span>Discover People</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <Link
            href="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            <span>My Messages</span>
            {totalUnread && totalUnread > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1.5 text-[10px] font-bold text-white">
                {totalUnread}
              </span>
            )}
          </Link>
        </div>
      </section>

      {/* Features Section - Lightweight */}
      <section className="px-4 py-16 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 px-4 py-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              FEATURES
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">
              Everything you need
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Built for speed, privacy, and a premium experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: "Real-Time", desc: "Instant message delivery", color: "text-amber-500", bg: "bg-amber-100 dark:bg-amber-900/30" },
              { icon: Heart, title: "Reactions", desc: "Express with emojis", color: "text-pink-500", bg: "bg-pink-100 dark:bg-pink-900/30" },
              { icon: Users, title: "Groups", desc: "Chat with everyone", color: "text-violet-500", bg: "bg-violet-100 dark:bg-violet-900/30" },
              { icon: Bell, title: "Notifications", desc: "Never miss a message", color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
              { icon: Shield, title: "Secure", desc: "Privacy first", color: "text-emerald-500", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
              { icon: Globe, title: "Presence", desc: "See who's online", color: "text-indigo-500", bg: "bg-indigo-100 dark:bg-indigo-900/30" },
            ].map((f, i) => (
              <div key={i} className="rounded-xl bg-slate-50 dark:bg-slate-800 p-5 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg mb-3", f.bg)}>
                  <f.icon className={cn("h-5 w-5", f.color)} />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-4 py-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <MessageCircle className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-display text-sm font-bold text-slate-800 dark:text-white">Tars</span>
          </div>
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} Tars</p>
        </div>
      </footer>
    </div>
  );
}