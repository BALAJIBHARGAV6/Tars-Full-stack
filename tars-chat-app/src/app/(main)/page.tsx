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
  ArrowRight,
  Heart,
  Zap,
  Shield,
  Globe,
  Bell,
  Send,
} from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser, UserButton } from "@clerk/nextjs";
import UserList from "@/components/users/UserList";
import ConversationList from "@/components/conversations/ConversationList";
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
  const [showMessages, setShowMessages] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTarget, setTransitionTarget] = useState<"users" | "messages">("users");

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
          
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {transitionTarget === "messages" ? "Loading messages..." : "Loading people..."}
          </p>
        </div>
      </div>
    );
  }

  // ============= MY MESSAGES VIEW =============
  if (showMessages) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Navbar */}
        <div className="sticky top-0 z-50 flex justify-center px-4 py-3">
          <nav className="flex items-center justify-between w-full max-w-2xl rounded-full bg-white dark:bg-slate-900 shadow-md border border-slate-200 dark:border-slate-800 px-4 py-2.5">
            <button
              onClick={() => setShowMessages(false)}
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
            <div className="w-44 h-44 sm:w-52 sm:h-52 mx-auto mb-6">
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
                My <span className="gradient-text">Messages</span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Your conversations — tap any chat to continue
              </p>
            </div>

            {/* Conversations List */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <ConversationList />
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 px-4 py-5 mt-8">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-violet-500/20">
                  <MessageCircle className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-extrabold text-base bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Tars Chat</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <span>Developed with</span>
                  <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
                  <span>by</span>
                  <span className="font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Tars</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-600">© {new Date().getFullYear()} Tars. All rights reserved.</p>
              </div>
              <div className="hidden sm:block w-24" />
            </div>
          </footer>
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
            
            {/* Lottie Animation - Bigger */}
            <div className="w-52 h-52 sm:w-64 sm:h-64 lg:w-72 lg:h-72 mx-auto mb-6">
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
          <footer className="bg-white dark:bg-slate-900 border-t border-slate-200/60 dark:border-slate-800 px-4 py-5 mt-8">
            <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Left: Brand */}
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-violet-500/20">
                  <MessageCircle className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="font-extrabold text-base bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Tars Chat</span>
              </div>
              {/* Center: Developed by + Copyright */}
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
                  <span>Developed with</span>
                  <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
                  <span>by</span>
                  <span className="font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Tars</span>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-600">© {new Date().getFullYear()} Tars. All rights reserved.</p>
              </div>
              {/* Right: Spacer for desktop symmetry */}
              <div className="hidden sm:block w-24" />
            </div>
          </footer>
        </div>
      </div>
    );
  }

  // ============= MAIN INTERACTION PAGE =============
  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-white dark:bg-slate-950">
      {/* Navbar */}
      <div className="sticky top-0 z-50 flex justify-center px-4 py-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <nav className="flex items-center justify-between w-full max-w-2xl rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800 px-4 py-2.5">
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
      <section className="flex flex-col items-center justify-center px-4 py-12">
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
              setTransitionTarget("users");
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

          <button
            onClick={() => {
              setTransitionTarget("messages");
              setIsTransitioning(true);
              setTimeout(() => {
                setShowMessages(true);
                setIsTransitioning(false);
              }, 600);
            }}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] transition-all"
          >
            <MessageCircle className="h-4 w-4" />
            <span>My Messages</span>
            {totalUnread && totalUnread > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-500 px-1.5 text-[10px] font-bold text-white">
                {totalUnread}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-16 sm:py-20 bg-white dark:bg-slate-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3">
              Everything you need to
            </h2>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="gradient-text">stay connected</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Built for speed, privacy, and a premium experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Real-Time Messaging */}
            <div className="rounded-2xl p-6 bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-amber-500/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 bg-amber-100 dark:bg-amber-500/20">
                <Zap className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Real-Time Messaging</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Messages delivered instantly with zero delay</p>
            </div>

            {/* Emoji Reactions */}
            <div className="rounded-2xl p-6 bg-pink-50 dark:bg-slate-800 border border-pink-200 dark:border-pink-500/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 bg-pink-100 dark:bg-pink-500/20">
                <Heart className="h-6 w-6 text-pink-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Emoji Reactions</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">React to messages with emojis, double-tap for ❤️</p>
            </div>

            {/* Group Chats */}
            <div className="rounded-2xl p-6 bg-violet-50 dark:bg-slate-800 border border-violet-200 dark:border-violet-500/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 bg-violet-100 dark:bg-violet-500/20">
                <Users className="h-6 w-6 text-violet-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Group Chats</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Create groups and chat with everyone at once</p>
            </div>

            {/* Smart Notifications */}
            <div className="rounded-2xl p-6 bg-blue-50 dark:bg-slate-800 border border-blue-200 dark:border-blue-500/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 bg-blue-100 dark:bg-blue-500/20">
                <Bell className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Smart Notifications</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Real-time unread badges keep you informed</p>
            </div>

            {/* Secure & Private */}
            <div className="rounded-2xl p-6 bg-emerald-50 dark:bg-slate-800 border border-emerald-200 dark:border-emerald-500/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 bg-emerald-100 dark:bg-emerald-500/20">
                <Shield className="h-6 w-6 text-emerald-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Secure & Private</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">Your conversations are private and secure</p>
            </div>

            {/* Online Presence */}
            <div className="rounded-2xl p-6 bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-indigo-500/40 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 bg-indigo-100 dark:bg-indigo-500/20">
                <Globe className="h-6 w-6 text-indigo-500" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Online Presence</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">See who's online with live indicators</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-16 sm:py-20 bg-white dark:bg-slate-950">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Start your first
              </h2>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                <span className="gradient-text">conversation</span> today
              </h2>
              <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                Discover people, send messages, react with emojis — everything you love, in one place.
              </p>

              <button
                onClick={() => setShowUsers(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/35 active:scale-[0.98] transition-all"
              >
                <Send className="h-4 w-4" />
                <span>Start Chatting</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
                {[
                  { value: "0ms", label: "Latency", color: "text-amber-500" },
                  { value: "∞", label: "Group Size", color: "text-violet-500" },
                  { value: "100%", label: "Encrypted", color: "text-emerald-500" },
                  { value: "24/7", label: "Available", color: "text-blue-500" },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 p-4">
                    <p className={cn("text-2xl sm:text-3xl font-bold", stat.color)}>{stat.value}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200/60 dark:border-slate-800 px-4 sm:px-6 py-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Brand */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-violet-500/20">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <span className="font-extrabold text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Tars Chat</span>
          </div>
          {/* Center: Developed by + Copyright */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-500 dark:text-slate-400">
              <span>Developed with</span>
              <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500 animate-pulse" />
              <span>by</span>
              <span className="font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Tars</span>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-600">© {new Date().getFullYear()} Tars. All rights reserved.</p>
          </div>
          {/* Right: Spacer for desktop symmetry */}
          <div className="hidden sm:block w-28" />
        </div>
      </footer>
    </div>
  );
}