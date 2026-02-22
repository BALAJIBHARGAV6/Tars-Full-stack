/* ========================================================
   HOME PAGE - High-Class Full-Screen Interaction Page
   
   - Floating glassmorphism navbar with glowing border
   - Full-viewport hero with premium Lottie
   - Elevated glassmorphism feature cards with glow borders
   - Animated CTA section
   - Professional footer
   ======================================================== */

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Users,
  Sparkles,
  ArrowRight,
  Send,
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
  { ssr: false }
);

export default function HomePage() {
  const { user } = useUser();
  const [showUsers, setShowUsers] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const totalUnread = useQuery(
    api.unread.getTotalUnread,
    user ? { userId: user.id } : "skip"
  );

  // Loading Transition Screen
  if (isTransitioning) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gradient-bg-hero">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6"
        >
          {/* Animated Logo */}
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-500 to-purple-600 blur-xl opacity-40 animate-pulse" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-green-400 shadow-2xl">
              <Users className="h-10 w-10 text-white" />
            </div>
          </div>
          
          {/* Loading spinner */}
          <div className="flex items-center gap-3">
            <svg className="animate-spin h-5 w-5 text-violet-600 dark:text-violet-400" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-base font-medium text-slate-600 dark:text-slate-300">Discovering people...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // Discover Users View - Premium Redesign
  if (showUsers) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden gradient-bg-hero">
        {/* Clean Navbar */}
        <div className="sticky top-0 z-50 flex justify-center px-4 py-4">
          <nav className="flex items-center justify-between w-full max-w-2xl rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 px-4 py-2.5">
            <button
              onClick={() => setShowUsers(false)}
              className="flex items-center gap-2.5 pl-1 group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-green-400 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <span className="font-display text-lg font-bold gradient-text">
                Tars
              </span>
            </button>
            <div className="flex items-center gap-2 pr-1">
              <ThemeToggle />
              <UserButton afterSignOutUrl="/sign-in" appearance={{ elements: { avatarBox: "h-9 w-9 ring-2 ring-violet-200/50 dark:ring-violet-800/50" } }} />
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            
            {/* Hero Header Section */}
            <div className="text-center mb-8">
              {/* Icon */}
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 shadow-xl shadow-violet-500/25 mb-5">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">
                Discover <span className="gradient-text">People</span>
              </h1>
              <p className="font-sans text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Find amazing people and start <span className="text-violet-600 dark:text-violet-400 font-semibold">meaningful</span> conversations
              </p>
            </div>

            {/* User List with enhanced styling */}
            <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-lg p-5 sm:p-6">
              <UserList />
            </div>
          </div>

          {/* Footer in Discover Page */}
          <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-10 sm:py-14 mt-12">
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                    <MessageCircle className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="font-display text-base font-bold text-slate-800 dark:text-white">
                    Tars Chat
                  </span>
                </div>
                <div className="flex flex-col items-center sm:items-end gap-1">
                  <p className="font-sans text-xs text-slate-600 dark:text-slate-400 tracking-wider uppercase font-semibold">
                    Developed By Tars
                  </p>
                  <p className="font-sans text-[10px] text-slate-500 dark:text-slate-500">
                    © {new Date().getFullYear()} Tars Messaging Platform
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  // ============= FULL-SCREEN INTERACTION PAGE =============
  return (
    <div className="flex flex-1 flex-col overflow-y-auto custom-scrollbar gradient-bg-hero">
      {/* ========= FLOATING NAVBAR ========= */}
      <div className="sticky top-0 z-50 flex justify-center px-4 py-4">
        <nav className="flex items-center justify-between w-full max-w-2xl rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-slate-200/50 dark:border-slate-700/50 px-4 py-2.5">
          <Link href="/" className="flex items-center gap-2.5 pl-0.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-green-400 shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
              <MessageCircle className="h-4 w-4 text-white" />
            </div>
            <span className="font-display text-lg font-bold gradient-text group-hover:opacity-90 transition-opacity">
              Tars
            </span>
          </Link>

          <div className="flex items-center gap-2 pr-0.5">
            <ThemeToggle />
            <UserButton
              afterSignOutUrl="/sign-in"
              appearance={{
                elements: {
                  avatarBox: "h-9 w-9 ring-2 ring-violet-200/50 dark:ring-violet-800/50 hover:ring-violet-400 transition-all cursor-pointer",
                },
              }}
            />
          </div>
        </nav>
      </div>

      {/* ========= HERO SECTION ========= */}
      <section className="relative flex flex-col items-center justify-center px-4 sm:px-6 pt-4 pb-12 sm:pt-6 sm:pb-16 min-h-[calc(100dvh-72px)] overflow-hidden gradient-bg-hero">
        {/* Simple background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-violet-100/40 via-transparent to-purple-100/30 dark:from-violet-950/30 dark:to-purple-950/20" />
        </div>

        {/* Lottie */}
        <div className="relative z-10 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 mb-4 sm:mb-6">
          <DotLottieReact
            src="https://lottie.host/3aa6ca0a-f9d7-4bf0-88ff-cd7b2dd01b2c/YobNNqyHC5.lottie"
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>

        {/* Title */}
        <div className="relative z-10 text-center mb-8 px-2">
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.15] tracking-tight">
            <span className="gradient-text">Tars</span> — Where <span className="gradient-text">chats</span>
            <br />
            come <span className="text-emerald-500 dark:text-emerald-400">alive</span>
          </h1>
          <p className="font-sans text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-4 sm:mt-5 leading-relaxed">
            The messaging platform built for those who appreciate
            <span className="font-semibold text-slate-700 dark:text-slate-300"> speed</span>,
            <span className="font-semibold text-slate-700 dark:text-slate-300"> design</span>, and
            <span className="font-semibold text-slate-700 dark:text-slate-300"> privacy</span>.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-5 w-full max-w-md px-4">
          {/* Primary Button - Discover People */}
          <button
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setShowUsers(true);
                setIsTransitioning(false);
              }, 800);
            }}
            className="group relative flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 px-8 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-[0.97] transition-all duration-200 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            <Users className="h-4 w-4 relative z-10" />
            <span className="relative z-10">Discover People</span>
            <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {/* Secondary Button - My Messages */}
          <Link
            href="/"
            className="group flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl px-8 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:border-violet-400 dark:hover:border-violet-500 hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg active:scale-[0.97] transition-all duration-200"
          >
            <MessageCircle className="h-4 w-4" />
            <span>My Messages</span>
            {totalUnread && totalUnread > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-500 px-1.5 text-[10px] font-bold text-white">
                {totalUnread}
              </span>
            )}
          </Link>
        </div>
      </section>

      {/* ========= FEATURES SECTION ========= */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-14 sm:py-24 lg:py-32">
        {/* Top divider glow line */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 max-w-lg h-px bg-gradient-to-r from-transparent via-violet-400/40 dark:via-violet-500/30 to-transparent" />

        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16 sm:mb-20">
            <motion.span
              initial={{ opacity: 0, y: 5 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-sans inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/15 backdrop-blur-sm border border-violet-300/30 dark:border-violet-600/30 px-5 py-2 text-xs font-bold text-violet-600 dark:text-violet-400 mb-6 tracking-wider"
            >
              <Sparkles className="h-3.5 w-3.5" />
              FEATURES
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white mb-5 tracking-tight leading-[1.1]"
            >
              Everything you need
              <br />
              <span className="gradient-text">to stay connected</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-sans text-sm sm:text-base lg:text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto"
            >
              Built for speed, privacy, and a premium experience.
            </motion.p>
          </div>

          {/* Feature cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                icon: Zap,
                title: "Real-Time Messaging",
                desc: "Messages delivered instantly with zero delay. Powered by WebSocket technology for blazing speed.",
                gradient: "from-amber-500 to-orange-600",
                glow: "group-hover:shadow-amber-500/15",
                iconBg: "bg-amber-500/10 dark:bg-amber-500/15",
                iconColor: "text-amber-600 dark:text-amber-400",
              },
              {
                icon: Heart,
                title: "Emoji Reactions",
                desc: "React to messages with emojis, double-tap for ❤️. Express yourself just like Instagram.",
                gradient: "from-pink-500 to-rose-600",
                glow: "group-hover:shadow-pink-500/15",
                iconBg: "bg-pink-500/10 dark:bg-pink-500/15",
                iconColor: "text-pink-600 dark:text-pink-400",
              },
              {
                icon: Users,
                title: "Group Chats",
                desc: "Create groups, add friends, and chat with everyone at once in beautiful real-time threads.",
                gradient: "from-violet-500 to-purple-600",
                glow: "group-hover:shadow-violet-500/15",
                iconBg: "bg-violet-500/10 dark:bg-violet-500/15",
                iconColor: "text-violet-600 dark:text-violet-400",
              },
              {
                icon: Bell,
                title: "Smart Notifications",
                desc: "Never miss a message. Real-time unread badges and live indicators keep you informed.",
                gradient: "from-blue-500 to-cyan-600",
                glow: "group-hover:shadow-blue-500/15",
                iconBg: "bg-blue-500/10 dark:bg-blue-500/15",
                iconColor: "text-blue-600 dark:text-blue-400",
              },
              {
                icon: Shield,
                title: "Secure & Private",
                desc: "Your conversations are private and secure. Built with industry-standard authentication.",
                gradient: "from-emerald-500 to-teal-600",
                glow: "group-hover:shadow-emerald-500/15",
                iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
                iconColor: "text-emerald-600 dark:text-emerald-400",
              },
              {
                icon: Globe,
                title: "Online Presence",
                desc: "See who's online with live indicators, typing status, and last seen timestamps.",
                gradient: "from-indigo-500 to-blue-600",
                glow: "group-hover:shadow-indigo-500/15",
                iconBg: "bg-indigo-500/10 dark:bg-indigo-500/15",
                iconColor: "text-indigo-600 dark:text-indigo-400",
              },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "glow-card group rounded-2xl bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl p-7 sm:p-8 hover:-translate-y-2 transition-all duration-300 shadow-sm hover:shadow-2xl border border-white/60 dark:border-violet-500/15 hover:border-violet-200/50 dark:hover:border-violet-500/30",
                  feat.glow
                )}
              >
                {/* Icon with soft background */}
                <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl mb-6 transition-transform duration-300 group-hover:scale-110", feat.iconBg)}>
                  <feat.icon className={cn("h-6 w-6", feat.iconColor)} />
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">
                  {feat.title}
                </h3>
                <p className="font-sans text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                  {feat.desc}
                </p>

                {/* Learn more hint */}
                <div className="mt-5 flex items-center gap-1.5 text-xs font-medium text-violet-500 dark:text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= CTA SECTION — Redesigned ========= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glow-card rounded-[2rem] bg-white/70 dark:bg-slate-800/80 backdrop-blur-xl border border-white/60 dark:border-violet-500/20 overflow-hidden shadow-xl dark:shadow-violet-900/20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left — text side */}
              <div className="p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
                <span className="font-sans inline-flex items-center gap-1.5 rounded-full bg-violet-500/10 dark:bg-violet-500/15 border border-violet-300/30 dark:border-violet-600/25 px-3.5 py-1 text-[11px] font-bold text-violet-600 dark:text-violet-400 mb-5 w-fit tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  GET STARTED
                </span>

                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white mb-3 tracking-tight leading-tight">
                  Start your first
                  <br />
                  <span className="gradient-text">conversation today</span>
                </h2>
                <p className="font-sans text-sm sm:text-base text-slate-500 dark:text-slate-300 mb-8 max-w-sm leading-relaxed">
                  Discover people, send messages, react with emojis — everything you love, in one place.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowUsers(true)}
                    className="group relative flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-[0.97] transition-all duration-200 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    <Send className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Start Chatting</span>
                    <ArrowRight className="h-4 w-4 relative z-10 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Right — stat cards grid */}
              <div className="p-6 sm:p-8 lg:p-10 grid grid-cols-2 gap-3 sm:gap-4">
                {[
                  {
                    icon: Zap,
                    value: "0ms",
                    label: "Message Latency",
                    color: "text-amber-500",
                    bg: "bg-amber-500/10 dark:bg-amber-500/15",
                  },
                  {
                    icon: Users,
                    value: "∞",
                    label: "Group Size",
                    color: "text-violet-500",
                    bg: "bg-violet-500/10 dark:bg-violet-500/15",
                  },
                  {
                    icon: Shield,
                    value: "100%",
                    label: "Encrypted",
                    color: "text-emerald-500",
                    bg: "bg-emerald-500/10 dark:bg-emerald-500/15",
                  },
                  {
                    icon: Globe,
                    value: "24/7",
                    label: "Available",
                    color: "text-blue-500",
                    bg: "bg-blue-500/10 dark:bg-blue-500/15",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="group rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-white/70 dark:border-violet-500/15 p-4 sm:p-5 hover:shadow-lg dark:hover:shadow-violet-900/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl mb-3", stat.bg)}>
                      <stat.icon className={cn("h-5 w-5", stat.color)} />
                    </div>
                    <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                      {stat.value}
                    </p>
                    <p className="font-sans text-[11px] sm:text-xs text-slate-400 dark:text-slate-400 mt-0.5 font-medium">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========= FOOTER — distinct background ========= */}
      <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-10 sm:py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/30">
                <MessageCircle className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="font-display text-base font-bold text-slate-800 dark:text-white">
                Tars Chat
              </span>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-1">
              <p className="font-sans text-xs text-slate-600 dark:text-slate-400 tracking-wider uppercase font-semibold">
                Developed By Tars
              </p>
              <p className="font-sans text-[10px] text-slate-500 dark:text-slate-500">
                © {new Date().getFullYear()} Tars Messaging Platform
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

