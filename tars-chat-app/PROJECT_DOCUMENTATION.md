# TARS CHAT APP — Complete Project Documentation

> **A Real-Time Chat Application built as an Internship Assignment**
> **Live URL:** https://tars-full-stack-rs7q.vercel.app
> **GitHub:** https://github.com/BALAJIBHARGAV6/Tars-Full-stack

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack Summary](#2-tech-stack-summary)
3. [Package-by-Package Explanation](#3-package-by-package-explanation)
   - 3.1 [Core Framework](#31-core-framework)
   - 3.2 [Backend & Database](#32-backend--database)
   - 3.3 [Authentication](#33-authentication)
   - 3.4 [UI Libraries](#34-ui-libraries)
   - 3.5 [State Management](#35-state-management)
   - 3.6 [Utility Libraries](#36-utility-libraries)
   - 3.7 [Dev Dependencies](#37-dev-dependencies)
4. [Architecture & Data Flow](#4-architecture--data-flow)
5. [Project Structure Explained](#5-project-structure-explained)
6. [Database Schema (Convex)](#6-database-schema-convex)
7. [Backend API Functions (Convex)](#7-backend-api-functions-convex)
8. [Frontend Components Breakdown](#8-frontend-components-breakdown)
9. [Custom React Hooks](#9-custom-react-hooks)
10. [Authentication Flow](#10-authentication-flow)
11. [Real-Time Features Explained](#11-real-time-features-explained)
12. [Routing & Page Structure](#12-routing--page-structure)
13. [Styling Approach](#13-styling-approach)
14. [Environment Variables](#14-environment-variables)
15. [How to Run Locally](#15-how-to-run-locally)
16. [Deployment (Vercel)](#16-deployment-vercel)
17. [Key Features List](#17-key-features-list)
18. [Interview Q&A — Common Questions](#18-interview-qa--common-questions)

---

## 1. Project Overview

**Tars Chat** is a full-stack, real-time messaging application. Users can:

- Sign up / sign in with Clerk authentication (Google, GitHub, email)
- Discover other users and start 1-on-1 direct message conversations
- Create group chats with multiple participants
- Send messages in real-time (messages appear instantly without refreshing)
- React to messages with emojis (👍 ❤️ 😂 😮 😢)
- See typing indicators ("John is typing...")
- See online/offline presence status with green dots
- Track unread message counts (badge on conversations + browser tab title)
- Toggle dark/light theme
- Responsive design — works on mobile, tablet, and desktop

**What makes this special:** The entire app is **real-time** — when User A sends a message, User B sees it instantly. When User A starts typing, User B sees "typing..." immediately. This is all powered by Convex's reactive subscriptions (explained below).

---

## 2. Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend Framework** | Next.js 16 (App Router) | React-based framework with server components, file-based routing |
| **UI Library** | React 19 | Component-based UI rendering |
| **Language** | TypeScript 5 | Type-safe JavaScript |
| **Backend / Database** | Convex | Real-time serverless backend + database |
| **Authentication** | Clerk | User sign-up/sign-in, session management |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |
| **Component Library** | shadcn/ui (Radix UI) | Pre-built accessible UI components |
| **Animations** | Framer Motion | React animation library |
| **Icons** | Lucide React | SVG icon library |
| **State Management** | Zustand | Lightweight global state |
| **Date Utilities** | date-fns | Date formatting and manipulation |
| **Lottie Animations** | @lottiefiles/dotlottie-react | Animated illustrations |
| **Toast Notifications** | Sonner | Beautiful toast messages |
| **Webhook Verification** | Svix | Verifies Clerk webhook signatures |
| **Deployment** | Vercel | Hosting and CI/CD |

---

## 3. Package-by-Package Explanation

### 3.1 Core Framework

#### `next` (v16.1.6) — The Main Framework
**What it is:** Next.js is a React framework built by Vercel. It adds features on top of React that plain React doesn't have.

**Why we use it:**
- **App Router** — File-based routing. Create a file at `app/chat/[id]/page.tsx` and it automatically becomes the `/chat/123` URL
- **Server Components** — Components that render on the server, reducing JavaScript sent to the browser
- **Client Components** — Interactive components (marked with `"use client"`) that run in the browser
- **API Routes** — Backend endpoints (like our webhook at `/api/webhooks/clerk`)
- **Middleware** — Code that runs before every request (we use it for auth protection)
- **Image Optimization** — Automatic image compression and resizing
- **Built-in TypeScript support**

**Key files:**
- `next.config.ts` — Configuration (image domains, React compiler)
- `src/app/layout.tsx` — Root layout wrapping every page
- `src/middleware.ts` — Route protection logic

#### `react` (v19.2.3) & `react-dom` (v19.2.3)
**What it is:** React is the JavaScript library for building user interfaces with **components** — reusable, self-contained pieces of UI.

**Key React concepts used in this project:**
- `useState` — Store component-level data (e.g., message text, emoji picker open/closed)
- `useEffect` — Run side effects (e.g., set up heartbeat on mount, listen for events)
- `useRef` — Reference DOM elements (e.g., textarea for auto-resize)
- `useCallback` — Memoize functions to prevent unnecessary re-renders
- `useContext` — Share data across components (used in ThemeProvider)
- `createContext` — Create a shared context (ThemeContext for dark/light mode)

#### `typescript` (v5)
**What it is:** TypeScript is JavaScript with **type annotations**. It catches bugs at compile time instead of runtime.

**Example from our code:**
```typescript
interface Message {
  content: string;       // Must be a string
  senderId: string;      // Must be a string
  reactions: Reaction[]; // Must be an array of Reaction objects
}
```
If you try to pass a number where a string is expected, TypeScript shows an error before you even run the code.

---

### 3.2 Backend & Database

#### `convex` (v1.32.0) — The Real-Time Backend
**What it is:** Convex is a **real-time serverless backend**. It replaces traditional backends (Express + MongoDB/PostgreSQL) with a single, reactive system.

**Why it's special:**
1. **Real-time by default** — When data changes in the database, all connected clients are updated instantly. No WebSocket setup needed.
2. **No server to manage** — Functions run serverlessly (Convex hosts them)
3. **Type-safe** — Database schema generates TypeScript types automatically
4. **No REST API needed** — Frontend calls backend functions directly

**How it works in our app:**
```
Frontend (React) ←→ Convex Cloud (Backend + Database)
```

- **Queries** (`query`) — Read data. They are *reactive* — they automatically re-run whenever the underlying data changes. Example: `getMessagesByConversation` re-runs when someone sends a new message.
- **Mutations** (`mutation`) — Write data. Example: `sendMessage` inserts a new message into the database.

**Key Convex files:**
| File | Purpose |
|------|---------|
| `convex/schema.ts` | Defines all database tables and their fields |
| `convex/users.ts` | User CRUD operations |
| `convex/conversations.ts` | Create/list/get conversations |
| `convex/messages.ts` | Send/get/delete messages + reactions |
| `convex/presence.ts` | Online/offline heartbeat system |
| `convex/typing.ts` | Typing indicator backend |
| `convex/unread.ts` | Unread message count tracking |
| `convex/_generated/` | Auto-generated types and API references |

**Frontend Convex hooks used:**
- `useQuery(api.messages.getMessagesByConversation, { conversationId })` — Subscribe to messages (auto-updates)
- `useMutation(api.messages.sendMessage)` — Call a mutation function
- `ConvexReactClient` — The client that connects to the Convex cloud
- `ConvexProviderWithClerk` — Integrates Convex with Clerk auth

---

### 3.3 Authentication

#### `@clerk/nextjs` (v6.38.1) — Authentication System
**What it is:** Clerk is a complete authentication service. It handles user sign-up, sign-in, session management, and user profiles.

**Why we use it (instead of building auth ourselves):**
- Pre-built sign-in/sign-up pages (beautiful UI out of the box)
- Supports OAuth providers (Google, GitHub, etc.)
- Manages JWT tokens automatically
- Provides React hooks (`useUser`, `useAuth`) for frontend
- Sends **webhooks** when users are created/updated

**How auth flows in our app:**
```
1. User visits /sign-in → Clerk's pre-built UI handles login
2. Clerk creates a session → JWT token stored in cookies
3. Middleware checks JWT on every request → Protects routes
4. Clerk webhook fires → Our webhook API syncs user to Convex DB
5. Frontend uses useUser() hook → Gets current user's data
6. ConvexProviderWithClerk → Passes auth to Convex backend
```

**Key Clerk components/hooks used:**
| Import | Purpose |
|--------|---------|
| `ClerkProvider` | Wraps app, provides auth context |
| `useUser()` | Returns current logged-in user data |
| `useAuth()` | Returns auth state (for Convex integration) |
| `UserButton` | Pre-built avatar dropdown (sign-out, profile) |
| `clerkMiddleware` | Protects routes in middleware |
| `createRouteMatcher` | Defines which routes are public |
| `WebhookEvent` | TypeScript type for webhook payloads |

#### `svix` (v1.85.0) — Webhook Verification
**What it is:** Svix is a library for verifying webhook signatures. When Clerk sends a webhook to our `/api/webhooks/clerk` endpoint, we need to verify it's actually from Clerk (not a malicious request).

**How it works:**
```typescript
const wh = new Webhook(CLERK_WEBHOOK_SECRET);
const evt = wh.verify(body, headers); // Throws if signature is invalid
```

---

### 3.4 UI Libraries

#### `radix-ui` (v1.4.3) — Headless UI Primitives
**What it is:** Radix UI provides **unstyled, accessible** UI components. They handle complex behavior (dropdowns, dialogs, tooltips) without imposing any look.

**We use Radix through shadcn/ui** (see below). Components used:
- `Dialog` — Modal windows (CreateGroupModal, ConfirmDialog)
- `DropdownMenu` — Context menus on messages (delete, react)
- `Avatar` — User profile pictures with fallback initials
- `Tooltip` — Hover information (message timestamps)
- `ScrollArea` — Custom scrollable containers
- `Badge` — Notification badges (unread counts)
- `Separator` — Visual dividers
- `Button` — Styled button with variants

#### `shadcn/ui` (dev dependency: `shadcn` v3.8.5)
**What it is:** shadcn/ui is NOT a regular npm package. It's a **code generator** that copies pre-built React components into your project. You own the code and can customize every line.

**How it works:**
```bash
npx shadcn add button    # Copies Button component into src/components/ui/button.tsx
npx shadcn add dialog    # Copies Dialog component into src/components/ui/dialog.tsx
```

**Our shadcn/ui components** (in `src/components/ui/`):
- `avatar.tsx` — Profile picture with fallback
- `badge.tsx` — Small label/counter
- `button.tsx` — Styled button with variants (default, outline, ghost)
- `card.tsx` — Container component
- `dialog.tsx` — Modal overlay
- `dropdown-menu.tsx` — Right-click / context menus
- `input.tsx` — Text input field
- `scroll-area.tsx` — Custom scrollbar container
- `separator.tsx` — Horizontal/vertical line
- `tooltip.tsx` — Hover popover

**Configuration:** `components.json` at the project root configures shadcn:
- Style: `new-york` (one of shadcn's design variants)
- Icon library: `lucide`
- Path aliases: `@/components`, `@/lib`, etc.

#### `lucide-react` (v0.575.0) — Icon Library
**What it is:** A library of 1000+ SVG icons as React components.

**Icons we use:**
```tsx
import { Send, Smile, ArrowLeft, MessageCircle, Users, X, Menu, Sparkles, Shield, Bell, Zap, Heart } from "lucide-react";
// Usage: <Send className="h-4 w-4" />
```

#### `framer-motion` (v12.34.3) — Animation Library
**What it is:** A production-grade animation library for React. Makes it easy to add enter/exit animations, gestures, and layout animations.

**Where we use it:**
- Page transitions (chat page slide-in animation)
- Typing indicator bouncing dots
- Mobile sidebar slide-in/slide-out
- AnimatePresence for mount/unmount animations
- Tooltip and modal entrance animations

**Example from our code:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 10 }}   // Start invisible & below
  animate={{ opacity: 1, y: 0 }}     // Animate to visible & in-place
  exit={{ opacity: 0, y: 10 }}       // Animate out
  transition={{ duration: 0.15 }}
>
```

#### `@lottiefiles/dotlottie-react` (v0.18.1) — Lottie Animations
**What it is:** Renders Lottie animation files (lightweight vector animations from JSON/dotlottie files).

**Where we use it:** The hero section of the landing page has an animated chat illustration loaded from LottieFiles CDN.

#### `sonner` (v2.0.7) — Toast Notifications
**What it is:** A toast notification library. Shows brief popup messages for success/error events.

**Usage:**
```tsx
import { toast } from "sonner";
toast.error("Failed to send message. Please try again.");
```
The `<Toaster />` component in root layout renders these.

---

### 3.5 State Management

#### `zustand` (v5.0.11) — Global State
**What it is:** A tiny (< 1KB) state management library. Alternative to Redux but much simpler.

**Why not Redux?** Redux requires boilerplate (actions, reducers, dispatch). Zustand is one function call:

```typescript
// src/lib/store.ts
import { create } from "zustand";

export const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));
```

**Usage in component:**
```tsx
const { isOpen, toggle, close } = useSidebarStore();
```

**We use Zustand for:** Mobile sidebar open/close state (needs to be shared across the layout and header components).

> **Note:** Most of our state comes directly from Convex (`useQuery` subscriptions) — Zustand is only needed for pure client-side UI state.

---

### 3.6 Utility Libraries

#### `date-fns` (v4.1.0) — Date Formatting
**What it is:** A modern JavaScript date utility library (alternative to Moment.js, but tree-shakeable).

**Functions we use:**
```typescript
import { format, isToday, isYesterday, isThisWeek, isThisYear, formatDistanceToNow } from "date-fns";

formatDistanceToNow(timestamp); // "5 minutes ago"
format(date, "h:mm a");        // "2:34 PM"
isToday(date);                  // true/false
```

#### `class-variance-authority` (v0.7.1) — Component Variants
**What it is:** A helper for creating components with multiple visual variants (used by shadcn/ui Button).

```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { default: "...", outline: "...", ghost: "..." },
    size: { default: "...", sm: "...", lg: "..." },
  },
});
```

#### `clsx` (v2.1.1) — Conditional Class Names
**What it is:** Tiny utility to conditionally join CSS class names.
```typescript
clsx("base", isActive && "active", isDisabled && "opacity-50")
// → "base active" (if isActive=true, isDisabled=false)
```

#### `tailwind-merge` (v3.5.0) — Tailwind Class Conflict Resolution
**What it is:** Merges Tailwind classes intelligently. If you pass `"px-2 px-4"`, it produces `"px-4"` (last one wins).

**Both clsx + tailwind-merge are combined in our `cn()` utility:**
```typescript
// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```
This is the single most-used utility in the project — every component uses `cn()` for conditional styling.

---

### 3.7 Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `tailwindcss` | v4 | CSS framework (processes utility classes at build time) |
| `@tailwindcss/postcss` | v4 | PostCSS plugin that compiles Tailwind CSS |
| `tw-animate-css` | v1.4.0 | Animation utilities for Tailwind (used by shadcn) |
| `typescript` | v5 | TypeScript compiler |
| `@types/node` | v20 | TypeScript types for Node.js APIs |
| `@types/react` | v19 | TypeScript types for React |
| `@types/react-dom` | v19 | TypeScript types for ReactDOM |
| `eslint` | v9 | JavaScript/TypeScript linter (finds code issues) |
| `eslint-config-next` | v16.1.6 | ESLint rules specific to Next.js |
| `babel-plugin-react-compiler` | v1.0.0 | React Compiler plugin (auto-optimizes re-renders) |
| `shadcn` | v3.8.5 | CLI tool to add shadcn/ui components |

---

## 4. Architecture & Data Flow

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client)                      │
│                                                          │
│  ┌──────────┐  ┌─────────┐  ┌────────────────────────┐ │
│  │  Clerk   │  │ Convex  │  │  React Components      │ │
│  │  Auth    │←→│ React   │←→│  (Chat, Messages, etc) │ │
│  │          │  │ Client  │  │                         │ │
│  └──────────┘  └────┬────┘  └────────────────────────┘ │
│                      │ WebSocket (real-time)             │
└──────────────────────┼───────────────────────────────────┘
                       │
         ┌─────────────┼────────────────┐
         │      CONVEX CLOUD            │
         │                              │
         │  ┌──────────┐ ┌──────────┐  │
         │  │ Queries  │ │ Mutations│  │
         │  │ (read)   │ │ (write)  │  │
         │  └──────┬───┘ └────┬─────┘  │
         │         │          │         │
         │  ┌──────┴──────────┴──────┐  │
         │  │      DATABASE          │  │
         │  │  users | conversations │  │
         │  │  messages | typing     │  │
         │  │  unreadCounts          │  │
         │  └────────────────────────┘  │
         └──────────────────────────────┘
                       ↑
         ┌─────────────┼────────────────┐
         │      CLERK (Auth)            │
         │  Webhook → /api/webhooks     │
         │  (Syncs users to Convex DB)  │
         └──────────────────────────────┘
```

### Data Flow for Sending a Message
```
1. User types in MessageInput → useState stores text
2. User presses Enter → sendMessage mutation called
3. Convex mutation runs:
   a. Inserts message into "messages" table
   b. Updates conversation's lastMessageAt
   c. Increments unread count for other participants
   d. Clears sender's typing status
4. Convex detects data changed → pushes update to all clients
5. Other user's useQuery(getMessagesByConversation) auto-updates
6. MessageList re-renders with the new message
7. useAutoScroll scrolls to bottom if user was at bottom
```

### Data Flow for Online Presence
```
1. User logs in → UserSyncProvider mounts
2. usePresence hook starts → heartbeat() mutation every 30 seconds
3. heartbeat sets isOnline=true, lastSeen=Date.now()
4. Other users' useQuery(getOnlineUsers) auto-updates
5. Green dots appear next to online users
6. On tab close → beforeunload event → setOffline() mutation
7. Safety net: markInactiveUsersOffline sweeps users with lastSeen > 60s
```

---

## 5. Project Structure Explained

```
tars-chat-app/
│
├── convex/                          # 🔵 BACKEND (Convex serverless functions)
│   ├── schema.ts                    # Database table definitions (the "SQL schema")
│   ├── users.ts                     # User CRUD operations
│   ├── conversations.ts             # Conversation create/list/get
│   ├── messages.ts                  # Message send/get/delete + reactions
│   ├── presence.ts                  # Online/offline heartbeat
│   ├── typing.ts                    # Typing indicator backend
│   ├── unread.ts                    # Unread message count tracking
│   ├── tsconfig.json                # TypeScript config for Convex folder
│   └── _generated/                  # ⚙️ AUTO-GENERATED by Convex CLI
│       ├── api.d.ts                 # TypeScript types for all API functions
│       ├── api.js                   # JavaScript references to API functions
│       ├── dataModel.d.ts           # TypeScript types matching schema.ts
│       ├── server.d.ts              # Server-side types
│       └── server.js                # Server-side utilities
│
├── public/                          # Static files served as-is
│
├── src/                             # 🟢 FRONTEND source code
│   ├── middleware.ts                # Route protection (runs before every request)
│   │
│   ├── app/                         # 📁 PAGES (Next.js App Router)
│   │   ├── globals.css              # Global styles + Tailwind theme configuration
│   │   ├── layout.tsx               # Root layout (wraps everything with providers)
│   │   ├── loading.tsx              # Global loading state
│   │   ├── not-found.tsx            # 404 page
│   │   │
│   │   ├── (auth)/                  # 🔐 AUTH PAGES (route group, no URL prefix)
│   │   │   ├── layout.tsx           # Auth layout (centered card)
│   │   │   ├── sign-in/[[...sign-in]]/page.tsx   # Sign-in page
│   │   │   └── sign-up/[[...sign-up]]/page.tsx   # Sign-up page
│   │   │
│   │   ├── (main)/                  # 🏠 MAIN APP (route group, no URL prefix)
│   │   │   ├── layout.tsx           # Main layout (sidebar + content area)
│   │   │   ├── page.tsx             # Home/landing page (hero + discover users)
│   │   │   └── chat/[id]/           # Dynamic chat route (/chat/abc123)
│   │   │       ├── page.tsx         # Chat conversation page
│   │   │       ├── loading.tsx      # Chat loading skeleton
│   │   │       └── error.tsx        # Chat error boundary
│   │   │
│   │   └── api/                     # 🔌 API ROUTES (server-side endpoints)
│   │       └── webhooks/clerk/route.ts  # Clerk webhook handler
│   │
│   ├── components/                  # 🧩 REACT COMPONENTS
│   │   ├── chat/                    # Chat-specific components
│   │   │   ├── ChatHeader.tsx       # Top bar with user info & back button
│   │   │   ├── MessageBubble.tsx    # Individual message bubble (sent/received)
│   │   │   ├── MessageInput.tsx     # Text input + emoji picker + send button
│   │   │   ├── MessageList.tsx      # Scrollable message container
│   │   │   ├── ReactionDisplay.tsx  # Shows reaction emojis on messages
│   │   │   ├── ReactionPicker.tsx   # Emoji reaction selector popup
│   │   │   └── TypingIndicator.tsx  # "User is typing..." animation
│   │   │
│   │   ├── conversations/           # Conversation list components
│   │   │   ├── ConversationItem.tsx # Single conversation row in sidebar
│   │   │   ├── ConversationList.tsx # Full conversation list with search
│   │   │   ├── ConversationListSkeleton.tsx  # Loading placeholder
│   │   │   └── CreateGroupModal.tsx # Modal for creating group chats
│   │   │
│   │   ├── providers/               # Context providers (wrap entire app)
│   │   │   ├── ConvexClientProvider.tsx  # Convex + Clerk integration
│   │   │   ├── UserSyncProvider.tsx     # Syncs Clerk user → Convex + presence
│   │   │   └── ThemeProvider.tsx        # Dark/light mode context
│   │   │
│   │   ├── shared/                  # Shared/reusable components
│   │   │   ├── ConfirmDialog.tsx    # "Are you sure?" confirmation modal
│   │   │   ├── EmptyState.tsx       # Empty state illustration
│   │   │   ├── GroupAvatar.tsx      # Overlapping avatars for groups
│   │   │   ├── LoadingSpinner.tsx   # Spinner animation
│   │   │   ├── MobileBackButton.tsx # Back arrow navigation button
│   │   │   ├── NetworkStatus.tsx    # "You're offline" banner
│   │   │   ├── OnlineStatusDot.tsx  # Green/gray dot for online status
│   │   │   └── SkeletonLoader.tsx   # Placeholder loading animation
│   │   │
│   │   ├── ui/                      # 🎨 shadcn/ui components (generated)
│   │   │   ├── avatar.tsx           ├── button.tsx
│   │   │   ├── badge.tsx            ├── card.tsx
│   │   │   ├── dialog.tsx           ├── dropdown-menu.tsx
│   │   │   ├── input.tsx            ├── scroll-area.tsx
│   │   │   ├── separator.tsx        └── tooltip.tsx
│   │   │
│   │   └── users/                   # User-related components
│   │       ├── UserCard.tsx         # User profile card (click to start chat)
│   │       ├── UserList.tsx         # Grid of user cards
│   │       └── UserSearch.tsx       # Search input for users
│   │
│   ├── hooks/                       # 🪝 CUSTOM REACT HOOKS
│   │   ├── useAutoScroll.ts         # Smart scroll to bottom for messages
│   │   ├── useMediaQuery.ts         # Responsive breakpoint detection
│   │   ├── usePresence.ts           # Online/offline heartbeat
│   │   └── useTyping.ts            # Typing indicator with debounce
│   │
│   ├── lib/                         # 🔧 UTILITIES & CONSTANTS
│   │   ├── constants.ts             # App-wide configuration values
│   │   ├── date-formatters.ts       # Smart date/time formatting
│   │   ├── store.ts                 # Zustand global state (sidebar)
│   │   └── utils.ts                 # cn() — Tailwind class merge utility
│   │
│   └── types/                       # 📝 TYPESCRIPT TYPE DEFINITIONS
│       └── index.ts                 # All custom types (User, Message, etc.)
│
├── components.json                  # shadcn/ui configuration
├── eslint.config.mjs                # ESLint configuration
├── next.config.ts                   # Next.js configuration
├── next-env.d.ts                    # Next.js TypeScript declarations
├── package.json                     # Dependencies and scripts
├── postcss.config.mjs               # PostCSS config (Tailwind plugin)
└── tsconfig.json                    # TypeScript configuration
```

### Folder Naming Conventions

- **`(auth)` and `(main)`** — Parenthesized folders are **route groups** in Next.js. They create separate layouts WITHOUT affecting the URL. So `/sign-in` uses the `(auth)/layout.tsx` and `/` uses `(main)/layout.tsx`.
- **`[id]`** — Square brackets mean **dynamic route**. `/chat/[id]` matches `/chat/abc123` and `id` becomes a parameter.
- **`[[...sign-in]]`** — Double brackets + spread means **optional catch-all route**. Matches `/sign-in`, `/sign-in/factor-one`, `/sign-in/sso-callback`, etc. (Clerk needs this for multi-step auth flows).
- **`_generated/`** — Underscore prefix means auto-generated files. Don't edit these manually.

---

## 6. Database Schema (Convex)

Defined in `convex/schema.ts`. There are **5 tables**:

### `users` Table
| Field | Type | Description |
|-------|------|-------------|
| `clerkId` | string | Unique ID from Clerk auth system |
| `name` | string | Display name |
| `email` | string | Email address |
| `avatarUrl` | string | Profile picture URL |
| `isOnline` | boolean | Currently active? |
| `lastSeen` | number | Unix timestamp of last activity |
| `createdAt` | number | Account creation timestamp |

**Indexes:**
- `by_clerk_id` on `[clerkId]` — Fast lookup by Clerk ID
- `by_online` on `[isOnline]` — Filter online/offline users

### `conversations` Table
| Field | Type | Description |
|-------|------|-------------|
| `isGroup` | boolean | Group chat or 1-on-1 DM |
| `name` | string? | Optional group name |
| `participantIds` | string[] | Array of Clerk user IDs |
| `createdBy` | string | Who created the conversation |
| `lastMessageAt` | number | Most recent message timestamp |
| `createdAt` | number | Conversation creation timestamp |

**Index:** `by_last_message` on `[lastMessageAt]` — Sort by recent activity

### `messages` Table
| Field | Type | Description |
|-------|------|-------------|
| `conversationId` | ID (ref) | References conversations table |
| `senderId` | string | Clerk ID of sender |
| `content` | string | Message text |
| `isDeleted` | boolean | Soft-delete flag |
| `createdAt` | number | Send timestamp |
| `reactions` | array | `[{ emoji: string, userIds: string[] }]` |

**Indexes:** `by_conversation`, `by_created_at`

### `typingStatus` Table
| Field | Type | Description |
|-------|------|-------------|
| `conversationId` | ID (ref) | Which conversation |
| `userId` | string | Who is typing |
| `isTyping` | boolean | Currently typing? |
| `lastTypingAt` | number | Last keystroke timestamp |

**Indexes:** `by_conversation`, `by_user_conversation`

### `unreadCounts` Table
| Field | Type | Description |
|-------|------|-------------|
| `conversationId` | ID (ref) | Which conversation |
| `userId` | string | For which user |
| `count` | number | Number of unread messages |
| `lastReadAt` | number | When user last read this conversation |

**Indexes:** `by_conversation_and_user`, `by_user`

---

## 7. Backend API Functions (Convex)

### `convex/users.ts` — User Management
| Function | Type | What it does |
|----------|------|-------------|
| `createOrUpdateUser` | mutation | Creates or updates a user record (called after login) |
| `getAllUsers` | query | Returns all registered users |
| `getUserByClerkId` | query | Finds one user by their Clerk ID |
| `getUserById` | query | Finds one user by Convex document ID |
| `getUsersByClerkIds` | query | Batch-fetches users for group chat participant lists |
| `updateOnlineStatus` | mutation | Sets user's online/offline status |
| `updateLastSeen` | mutation | Updates the "last active" timestamp |
| `markInactiveUsersOffline` | mutation | Background sweep — marks users offline if inactive >60s |

### `convex/conversations.ts` — Conversation Management
| Function | Type | What it does |
|----------|------|-------------|
| `createOrGetConversation` | mutation | Finds existing DM or creates a new one between two users |
| `getUserConversations` | query | Gets all conversations for a user with enriched data (other user info, last message preview, unread count) |
| `getConversationById` | query | Gets one conversation with resolved participant objects |
| `createGroupConversation` | mutation | Creates a group chat with name and participant list |

### `convex/messages.ts` — Message Operations
| Function | Type | What it does |
|----------|------|-------------|
| `sendMessage` | mutation | Sends a message + updates conversation timestamp + increments unread counts |
| `getMessagesByConversation` | query | Gets all messages in a conversation (sorted chronologically) |
| `deleteMessage` | mutation | Soft-deletes a message (only sender can delete) |
| `toggleReaction` | mutation | Adds or removes an emoji reaction (toggles) |

### `convex/presence.ts` — Online Status
| Function | Type | What it does |
|----------|------|-------------|
| `heartbeat` | mutation | "I'm alive" signal — sets online=true + updates lastSeen |
| `getOnlineUsers` | query | Returns all currently online users |
| `setOffline` | mutation | Explicitly marks a user offline |

### `convex/typing.ts` — Typing Indicator
| Function | Type | What it does |
|----------|------|-------------|
| `setTyping` | mutation | Creates/updates typing status record |
| `getTypingUsers` | query | Returns users typing in a conversation (filtered to last 3s) |

### `convex/unread.ts` — Unread Counts
| Function | Type | What it does |
|----------|------|-------------|
| `markAsRead` | mutation | Resets unread count to 0 when user opens a conversation |
| `getUnreadCounts` | query | Gets all unread counts for a user |
| `getTotalUnread` | query | Sum of all unread counts (used for tab title "( 3) Tars Chat") |

---

## 8. Frontend Components Breakdown

### Provider Components (Wrap the App)

| Component | File | Purpose |
|-----------|------|---------|
| `ConvexClientProvider` | `providers/ConvexClientProvider.tsx` | Connects frontend to Convex backend via ClerkProvider → ConvexProviderWithClerk |
| `UserSyncProvider` | `providers/UserSyncProvider.tsx` | On mount: syncs Clerk user data to Convex DB + starts presence heartbeat |
| `ThemeProvider` | `providers/ThemeProvider.tsx` | Manages dark/light/system theme via React Context + localStorage |

**Provider nesting order** (in `layout.tsx`):
```
ThemeProvider → ConvexClientProvider (ClerkProvider → ConvexProviderWithClerk) → TooltipProvider → Page
```

### Chat Components

| Component | Purpose | Key Features |
|-----------|---------|-------------|
| `ChatHeader` | Top bar in chat view | Back button, user avatar with gradient ring, online status dot, name, "Online" / "Last seen X ago" |
| `MessageList` | Scrollable message container | Date separators, auto-scroll, "scroll to bottom" button, empty state |
| `MessageBubble` | Individual message | Sent (right, gradient) vs received (left, white), timestamp tooltip, delete option, reactions |
| `MessageInput` | Message composition | Auto-resizing textarea, emoji picker grid, gradient send button, Enter to send, Shift+Enter for newline |
| `ReactionPicker` | Emoji reaction selector | 5 quick-reaction emojis on message hover |
| `ReactionDisplay` | Shows reactions under message | Clickable reaction pills with count |
| `TypingIndicator` | "User is typing..." | Avatar + animated bouncing dots |

### Conversation Components

| Component | Purpose |
|-----------|---------|
| `ConversationList` | Sidebar list of all conversations with search and "Create Group" button |
| `ConversationItem` | Single conversation row — avatar, name, message preview, time, unread badge |
| `ConversationListSkeleton` | Loading placeholder while conversations load |
| `CreateGroupModal` | Modal to create a group chat — search users, select multiple, set group name |

### User Components

| Component | Purpose |
|-----------|---------|
| `UserList` | Grid of all users (for "Discover People" page) |
| `UserCard` | Single user card — avatar, name, email, online dot, click to start conversation |
| `UserSearch` | Search input to filter users by name |

### Shared/Utility Components

| Component | Purpose |
|-----------|---------|
| `MobileBackButton` | Back arrow button (uses `router.back()`) |
| `OnlineStatusDot` | Green (online) or gray (offline) indicator dot |
| `GroupAvatar` | Overlapping avatars showing group participants |
| `NetworkStatus` | Banner shown when user loses internet connection |
| `EmptyState` | Illustrated empty state (no messages, no conversations) |
| `ConfirmDialog` | "Are you sure you want to delete?" confirmation |
| `LoadingSpinner` | Animated spinner for loading states |
| `SkeletonLoader` | Shimmer placeholder for loading content |

---

## 9. Custom React Hooks

### `usePresence(clerkId: string)`
**File:** `src/hooks/usePresence.ts`
**Purpose:** Keeps the user's "online" status alive.

**How it works:**
1. On mount → calls `heartbeat()` mutation (sets `isOnline=true`)
2. Sets up `setInterval` → calls `heartbeat()` every 30 seconds
3. Listens for `visibilitychange` → sends heartbeat when tab becomes active again
4. Listens for `beforeunload` → calls `setOffline()` when browser closes
5. On unmount → calls `setOffline()` and clears the interval

### `useTyping(conversationId, userId)`
**File:** `src/hooks/useTyping.ts`
**Purpose:** Sends typing status with smart debouncing.

**How it works:**
- Returns `{ handleTyping, stopTyping }`
- `handleTyping()` — Called on every keystroke. Sends `isTyping: true` on first call, then ignores repeated calls. After 2 seconds of no keystrokes, sends `isTyping: false`.
- `stopTyping()` — Called explicitly when message is sent. Immediately sends `isTyping: false`.

### `useAutoScroll(messageCount: number)`
**File:** `src/hooks/useAutoScroll.ts`
**Purpose:** Smart scroll behavior in message list.

**How it works:**
- Returns `{ scrollRef, showScrollButton, scrollToBottom }`
- Tracks if user is at the bottom of the scroll container
- When new messages arrive AND user is at bottom → auto-scroll down
- When new messages arrive AND user has scrolled up → show "↓ New messages" button
- Uses `requestAnimationFrame` for throttled scroll event handling

### `useMediaQuery(query: string)`
**File:** `src/hooks/useMediaQuery.ts`
**Purpose:** Detect responsive breakpoints.

**Example:**
```tsx
const isDesktop = useMediaQuery("(min-width: 768px)");
// isDesktop = true if screen width ≥ 768px
```

---

## 10. Authentication Flow

```
┌─────────────────────────────────────────────────────┐
│                  AUTHENTICATION FLOW                 │
└─────────────────────────────────────────────────────┘

  STEP 1: User visits the app
  ┌──────────────────────┐
  │ middleware.ts runs    │── Is route public? ───→ YES → Allow through
  │ (clerkMiddleware)     │                             (sign-in, sign-up, webhooks)
  └──────────┬───────────┘
             │ NO (protected route like /chat/...)
             ↓
  ┌──────────────────────┐
  │ Is user logged in?   │── NO → Redirect to /sign-in
  │ (JWT token valid?)   │
  └──────────┬───────────┘
             │ YES
             ↓
  ┌──────────────────────┐
  │ Page renders          │
  │ (user is authed)      │
  └───────────────────────┘

  STEP 2: First time user signup
  ┌──────────────────────┐
  │ User signs up via     │
  │ Clerk (Google/email)  │
  └──────────┬───────────┘
             │
             ↓
  ┌──────────────────────┐     ┌──────────────────────┐
  │ Clerk fires webhook  │────→│ POST /api/webhooks/  │
  │ "user.created" event │     │ clerk/route.ts       │
  └──────────────────────┘     └──────────┬───────────┘
                                          │
                                          ↓
                               ┌──────────────────────┐
                               │ Svix verifies         │
                               │ webhook signature     │
                               └──────────┬───────────┘
                                          │
                                          ↓
                               ┌──────────────────────┐
                               │ Creates user in       │
                               │ Convex database       │
                               │ (createOrUpdateUser)  │
                               └──────────────────────┘

  STEP 3: Client-side sync (backup)
  ┌──────────────────────┐
  │ UserSyncProvider      │── Calls createOrUpdateUser
  │ mounts on login       │── Starts usePresence heartbeat
  └──────────────────────┘
```

**Why two sync mechanisms (webhook + client)?**
- **Webhook** is the primary mechanism — guaranteed by Clerk
- **UserSyncProvider** is a safety net — handles edge cases where webhook might be delayed

---

## 11. Real-Time Features Explained

### How Convex Real-Time Works
Unlike REST APIs where you "fetch once and get stale data," Convex **queries are subscriptions**:

```tsx
// This is NOT a one-time fetch. It's a LIVE subscription.
const messages = useQuery(api.messages.getMessagesByConversation, { conversationId });
```

When ANY user sends a message to that conversation, Convex:
1. Detects the `messages` table changed
2. Re-runs the query function on the server
3. Pushes new results to ALL subscribed clients via WebSocket
4. React re-renders with new data

**No polling. No manual refresh. Instant updates.**

### Feature: Real-Time Messaging
- `sendMessage` mutation inserts into DB → triggers subscription update
- All participants' `MessageList` auto-updates

### Feature: Typing Indicators
- User's keystrokes call `handleTyping()` → `setTyping({ isTyping: true })` mutation
- Other user's `useQuery(api.typing.getTypingUsers)` auto-updates
- After 2s of no input → `setTyping({ isTyping: false })`
- `TypingIndicator` component shows animated dots

### Feature: Online Presence
- `usePresence` hook sends `heartbeat()` every 30 seconds
- `OnlineStatusDot` reflects `user.isOnline` from live query
- Safety: users not seen for >60s are swept offline

### Feature: Unread Counts
- `sendMessage` increments `unreadCounts` for all participants except sender
- Opening a chat calls `markAsRead()` → resets count to 0
- `ConversationItem` shows unread badge from live subscription
- Tab title shows total: `(3) Tars Chat`

### Feature: Emoji Reactions
- Click emoji → `toggleReaction` mutation (add/remove)
- `ReactionDisplay` shows reaction pills with counts
- Live updates — other users see reactions appear instantly

---

## 12. Routing & Page Structure

### Next.js App Router Routing

| URL | File | Description |
|-----|------|-------------|
| `/` | `src/app/(main)/page.tsx` | Landing page → Hero + Features + Discover Users |
| `/chat/[id]` | `src/app/(main)/chat/[id]/page.tsx` | Individual chat conversation |
| `/sign-in` | `src/app/(auth)/sign-in/[[...sign-in]]/page.tsx` | Clerk sign-in page |
| `/sign-up` | `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx` | Clerk sign-up page |
| `/api/webhooks/clerk` | `src/app/api/webhooks/clerk/route.ts` | Clerk webhook endpoint |

### Layout Hierarchy
```
Root Layout (layout.tsx) — Fonts, ThemeProvider, ConvexClientProvider
  ├── (auth)/layout.tsx — Centered card layout for auth pages
  │     ├── /sign-in
  │     └── /sign-up
  │
  └── (main)/layout.tsx — Sidebar + content layout
        ├── / — Home page (full-screen, no sidebar)
        └── /chat/[id] — Chat page (sidebar visible on desktop)
```

### How the Main Layout Works
The `(main)/layout.tsx` detects the current route:
- **Home page (`/`)** → Renders full-screen (no sidebar). The page.tsx has its own navbar, hero, features, and footer.
- **Chat pages (`/chat/[id]`)** → Shows desktop sidebar (conversation list) on the left + chat content on the right. Mobile shows a hamburger menu that slides in the sidebar.

---

## 13. Styling Approach

### Tailwind CSS v4
This project uses **Tailwind CSS v4** which is different from v3:
- **No `tailwind.config.ts`** — Configuration is done in CSS using `@theme` blocks
- **CSS-first configuration** in `globals.css`
- Uses `@import "tailwindcss"` instead of `@tailwind base/components/utilities`

### Key Styling Patterns

**1. Utility-First Approach:**
```tsx
<div className="flex items-center gap-3 rounded-xl p-4 bg-white dark:bg-slate-800">
```
Each class = one CSS property. Composed together inline.

**2. Dark Mode:**
```tsx
className="text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-900"
```
The `dark:` prefix applies when `<html>` has the `dark` class (managed by ThemeProvider).

**3. Responsive Design:**
```tsx
className="px-3 sm:px-4 md:px-5 text-sm sm:text-base"
```
`sm:` = ≥640px, `md:` = ≥768px, `lg:` = ≥1024px

**4. CSS Custom Properties (variables):**
```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
}
.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
}
```

**5. Custom Utility Classes** (defined in globals.css):
- `.gradient-text` — Gradient text effect (purple to green)
- `.gradient-bg-hero` — Background gradient for the hero section
- `.glass` — Glassmorphism effect (frosted glass)
- `.sidebar-gradient` — Sidebar background gradient
- `.custom-scrollbar` — Styled thin scrollbar

**6. The `cn()` utility** — Used everywhere for conditional styling:
```tsx
className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "ghost" && "ghost-classes",
)}
```

---

## 14. Environment Variables

The app requires 4 environment variables in `.env.local`:

```env
# Convex — Real-time backend URL
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Clerk — Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk — Webhook secret (for verifying webhook signatures)
CLERK_WEBHOOK_SECRET=whsec_...
```

| Variable | Prefix | Meaning |
|----------|--------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | `NEXT_PUBLIC_` = available in browser | URL of the Convex deployment |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `NEXT_PUBLIC_` = available in browser | Clerk's public key (safe to expose) |
| `CLERK_SECRET_KEY` | No prefix = server-only | Clerk's secret key (NEVER expose to browser) |
| `CLERK_WEBHOOK_SECRET` | No prefix = server-only | Verifies webhook signatures from Clerk |

---

## 15. How to Run Locally

### Prerequisites
- Node.js 18+ installed
- npm (comes with Node.js)
- A Clerk account (https://clerk.com)
- A Convex account (https://convex.dev)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/BALAJIBHARGAV6/Tars-Full-stack.git
cd Tars-Full-stack/tars-chat-app

# 2. Install dependencies
npm install

# 3. Create .env.local file with your keys
# (See Environment Variables section above)

# 4. Start Convex backend (in a separate terminal)
npx convex dev

# 5. Start Next.js development server
npm run dev

# 6. Open http://localhost:3000 in your browser
```

### Available Scripts (from package.json)
| Script | Command | What it does |
|--------|---------|-------------|
| `dev` | `next dev` | Starts development server with hot-reload |
| `build` | `next build` | Creates optimized production build |
| `start` | `next start` | Runs production build locally |
| `lint` | `eslint` | Checks code for issues |

---

## 16. Deployment (Vercel)

### How it's deployed
1. Push code to GitHub (`main` branch)
2. Vercel is connected to the GitHub repo
3. Every push triggers automatic build + deploy
4. Environment variables are configured in Vercel dashboard
5. Convex backend is deployed separately via `npx convex deploy`

### Build Process
```
Next.js Build →
  1. Compile TypeScript → JavaScript
  2. Bundle client components
  3. Generate static pages (sign-in, sign-up, 404)
  4. Create serverless functions (API routes, middleware)
  5. Optimize images and fonts
  6. Output to .next/ folder
  7. Vercel serves from global CDN
```

---

## 17. Key Features List

| # | Feature | Frontend | Backend |
|---|---------|----------|---------|
| 1 | **User Authentication** | Clerk sign-in/sign-up pages | Webhook syncs user data to Convex |
| 2 | **1-on-1 Direct Messages** | UserCard click → starts conversation | `createOrGetConversation` finds/creates DM |
| 3 | **Group Chats** | CreateGroupModal with user search | `createGroupConversation` mutation |
| 4 | **Real-Time Messaging** | MessageList with live subscription | `sendMessage` mutation + reactive query |
| 5 | **Emoji Reactions** | ReactionPicker + ReactionDisplay | `toggleReaction` mutation |
| 6 | **Built-in Emoji Picker** | Grid of 120+ emojis in MessageInput | N/A (client-side only) |
| 7 | **Typing Indicators** | TypingIndicator with animated dots | `setTyping` / `getTypingUsers` |
| 8 | **Online Presence** | Green dots + "Online" / "Last seen" | Heartbeat every 30s + sweep inactive |
| 9 | **Unread Message Counts** | Badge on conversations + tab title | `incrementUnread` / `markAsRead` |
| 10 | **Message Deletion** | Soft delete via dropdown menu | `deleteMessage` (sender-only) |
| 11 | **Dark/Light Theme** | ThemeProvider + localStorage | N/A (client-side only) |
| 12 | **Responsive Design** | Mobile sidebar + desktop layout | N/A |
| 13 | **Smart Auto-Scroll** | Scrolls on new messages if at bottom | N/A |
| 14 | **Date Separators** | "Today", "Yesterday", exact dates | N/A |
| 15 | **Network Status** | "You're offline" banner | N/A |
| 16 | **User Search** | Search/filter users by name | `getAllUsers` query |
| 17 | **Conversation Search** | Filter conversations in sidebar | Client-side filter |

---

## 18. Interview Q&A — Common Questions

### Q: "Walk me through the tech stack."
> "This is a full-stack real-time chat application. The frontend is built with **Next.js 16** using the App Router and **React 19** with **TypeScript**. For the backend and database, I used **Convex**, which is a real-time serverless backend — it handles both the database and server functions, and the big advantage is that queries are reactive, so when data changes, all clients update instantly via WebSockets without any manual polling. Authentication is handled by **Clerk**, which gives us pre-built sign-in/sign-up flows and session management. Styling uses **Tailwind CSS v4** with **shadcn/ui** components built on **Radix UI** for accessibility. I also used **Framer Motion** for animations, **Zustand** for client-side state management, and **date-fns** for date formatting. The app is deployed on **Vercel**."

### Q: "Why did you choose Convex over a traditional backend?"
> "Convex gives us real-time reactivity out of the box. In a traditional setup with Express + MongoDB, I'd need to set up WebSocket servers, manage connections, handle reconnections, and build a pub-sub system. With Convex, any `useQuery` hook automatically subscribes to data changes — when someone sends a message, all participants' UIs update instantly. This saved significant development time and made features like typing indicators and presence trivial to implement."

### Q: "How does real-time messaging work?"
> "When a user sends a message, the frontend calls a Convex `mutation` called `sendMessage`. This inserting a record into the `messages` table and updates the conversation's `lastMessageAt`. Because Convex queries are **reactive subscriptions**, every other user who has that conversation open has an active `useQuery(getMessagesByConversation)` subscription. Convex detects the data change and pushes the new results to all subscribed clients via WebSocket. React then re-renders the message list. There's no polling interval — it's instant push-based updates."

### Q: "How does authentication work?"
> "I used **Clerk** for authentication. When a user signs up, Clerk handles the entire flow — email verification, OAuth with Google/GitHub, session management. Clerk issues JWT tokens stored in cookies. Our **middleware** (`clerkMiddleware`) runs on every request and verifies the JWT — if the user isn't authenticated and the route is protected, they get redirected to `/sign-in`. When a new user is created, Clerk sends a **webhook** to our `/api/webhooks/clerk` endpoint, which we verify using **Svix** (to make sure it's really from Clerk), and then we sync the user data to our Convex database. We also have a client-side backup sync in `UserSyncProvider`."

### Q: "Explain the online presence system."
> "It works on a **heartbeat pattern**. When a user opens the app, the `usePresence` hook starts sending a `heartbeat()` mutation to Convex every 30 seconds — this sets `isOnline=true` and updates `lastSeen`. Other users subscribe to this data via queries, so they see green dots next to online users. When a user closes the tab, the `beforeunload` event triggers `setOffline()`. As a safety net, there's a `markInactiveUsersOffline` function that sweeps users who haven't sent a heartbeat in over 60 seconds."

### Q: "How does the typing indicator work?"
> "The `useTyping` hook provides a `handleTyping()` function that's called on every keystroke. On the first keystroke, it sends `isTyping: true` to Convex. It then uses **debouncing** — after 2 seconds of no typing, it automatically sends `isTyping: false`. On the receiving end, `getTypingUsers` query returns users whose `lastTypingAt` is within 3 seconds. This is also a reactive subscription, so the typing dots appear/disappear in real-time."

### Q: "What is shadcn/ui and why did you use it?"
> "shadcn/ui is not a traditional npm package — it's a code generator. You run `npx shadcn add button` and it copies the component source code into your project. This means you **own the code** and can customize every line. The components are built on **Radix UI** primitives which handle accessibility (keyboard navigation, screen readers, ARIA attributes) while shadcn adds the styling with Tailwind CSS. I used it for complex interactive components like Dialogs, Dropdown Menus, Tooltips, and Scroll Areas."

### Q: "How do you handle state management?"
> "Most of the app's state comes directly from **Convex reactive queries** — messages, conversations, typing status, presence — all live data from the server. For the small amount of client-side-only state (like the mobile sidebar open/close), I used **Zustand**, which is a lightweight alternative to Redux. For component-level state (message input text, emoji picker visibility), I use React's built-in `useState`. And for cross-component theme state, I use React Context in the `ThemeProvider`."

### Q: "How is the project structured?"
> "I followed the Next.js App Router conventions. The `convex/` folder contains all backend functions — organized by domain (users, messages, conversations, etc.). The `src/app/` folder contains pages organized by route groups: `(auth)` for login pages and `(main)` for the app. The `src/components/` folder is organized by feature: `chat/` for message-related components, `conversations/` for the sidebar, `providers/` for context wrappers, `shared/` for reusable components, and `ui/` for shadcn components. Custom hooks are in `hooks/`, utilities in `lib/`, and TypeScript types in `types/`."

### Q: "How did you deploy it?"
> "The app is deployed on **Vercel** which is the company behind Next.js, so the integration is seamless. I connected my GitHub repository to Vercel — every push to the `main` branch triggers an automatic build and deploy. Environment variables (Convex URL, Clerk keys) are configured in the Vercel dashboard. The Convex backend is deployed separately using `npx convex deploy`. Vercel serves the app from a global CDN with automatic HTTPS."

### Q: "What challenges did you face?"
> "A few notable ones: (1) **Build-time crashes** — Convex and Clerk clients tried to initialize during static page generation when environment variables weren't available. I solved this with lazy initialization patterns. (2) **Middleware compatibility** — Made the middleware defensive with try-catch so it doesn't crash the entire app if Clerk config is missing. (3) **Real-time performance** — Implemented throttled scroll handlers using `requestAnimationFrame` and debounced typing indicators to avoid excessive network calls. (4) **Dark mode consistency** — Ensured every component properly supports dark theme with Tailwind's `dark:` variant."

### Q: "What is the `cn()` function used everywhere?"
> "It's a utility that combines `clsx` and `tailwind-merge`. `clsx` lets you conditionally apply classes — like `clsx('base', isActive && 'active')`. `tailwind-merge` resolves Tailwind class conflicts — if you pass `'px-2 px-4'`, it keeps only `'px-4'`. Together, `cn()` lets you write clean conditional styles without worrying about class conflicts. It's the standard utility pattern for shadcn/ui projects."

---

## Quick Reference Card

```
TECH STACK AT A GLANCE
───────────────────────
Framework:    Next.js 16 (App Router) + React 19 + TypeScript
Backend:      Convex (real-time serverless DB + functions)
Auth:         Clerk (OAuth + JWT + webhooks)
Styling:      Tailwind CSS v4 + shadcn/ui (Radix UI)
Animations:   Framer Motion + Lottie
State:        Convex (server) + Zustand (client) + React Context (theme)
Icons:        Lucide React
Dates:        date-fns
Toasts:       Sonner
Deployment:   Vercel (frontend) + Convex Cloud (backend)

KEY COMMANDS
────────────
npm run dev          → Start local dev server
npx convex dev       → Start Convex backend dev
npm run build        → Production build
npx convex deploy    → Deploy Convex to production
```

---

*This document was created for the Tars Chat internship assignment project.*
