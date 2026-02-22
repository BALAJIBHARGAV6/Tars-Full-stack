/* ========================================================
   EMPTY STATE - Reusable Component for Empty Content Areas
   
   Shows a friendly message when there's no data to display.
   Used in: conversation list, message list, search results.
   ======================================================== */

"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      {/* Icon with social media style gradient background */}
      <motion.div 
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-purple-500 to-pink-500 shadow-xl shadow-violet-500/25"
      >
        <Icon className="h-10 w-10 text-white" />
      </motion.div>

      <h3 className="mb-2 font-display text-xl font-bold text-slate-800">
        {title}
      </h3>
      <p className="mb-6 max-w-sm text-sm text-slate-500 leading-relaxed">{description}</p>

      {/* Optional action button with social media gradient */}
      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
            >
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-xl hover:shadow-violet-500/30 hover:-translate-y-0.5"
            >
              {action.label}
            </button>
          )}
        </>
      )}
    </motion.div>
  );
}
