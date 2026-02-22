# Tars-Full-stack

A full-stack real-time chat application built with Next.js, Convex, and Clerk.

## 🚀 Features

- **Real-Time Messaging** — WebSocket-powered, zero-latency message delivery
- **Emoji Reactions** — React to messages with emojis, double-tap for ❤️  
- **Group Chats** — Create groups and chat with multiple users at once
- **Smart Notifications** — Live unread badges and browser tab indicators
- **Online Presence** — Live online/offline status and typing indicators
- **Secure & Private** — Industry-standard auth via Clerk

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + TypeScript |
| Backend | Convex (real-time serverless DB) |
| Auth | Clerk (user management) |
| Styling | Tailwind CSS v4 + Framer Motion |
| Fonts | Playfair Display + DM Sans |
| Animation | Lottie, Framer Motion |
| Deployment | Vercel + Convex Cloud |

## 📦 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in: NEXT_PUBLIC_CONVEX_URL, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY

# Run development server
npm run dev

# Run Convex backend (separate terminal)
npx convex dev
```

## 🌐 Environment Variables

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_url
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret
```

## 🚀 Deployment (Vercel)

1. Push this repo to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Deploy Convex: `npx convex deploy`
5. Vercel picks up `npm run build` automatically

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Sign-in / Sign-up pages
│   ├── (main)/          # Main app layout + pages
│   │   ├── page.tsx     # Interaction/landing page
│   │   └── chat/[id]/   # Individual chat pages
│   └── globals.css      # Global styles + custom utilities
├── components/
│   ├── chat/            # MessageBubble, MessageInput, etc.
│   ├── shared/          # ThemeToggle, LoadingSpinner, etc.
│   └── users/           # UserCard, UserList, etc.
├── hooks/               # Custom React hooks
└── lib/                 # Utilities

convex/                  # Convex backend functions
├── schema.ts            # Database schema
├── messages.ts          # Message mutations/queries
├── conversations.ts     # Conversation logic
└── users.ts             # User management
```

## 👤 Author

Developed by **Tars** — [@BALAJIBHARGAV6](https://github.com/BALAJIBHARGAV6)

---

© 2026 Tars Messaging Platform
