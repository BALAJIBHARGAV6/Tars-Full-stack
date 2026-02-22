import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* ====== LEFT PANEL - 3D Chat Bubbles Animation ====== */}
      <div
        className="relative hidden lg:flex lg:w-[50%] xl:w-[55%] flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0f0c29 0%, #1a0a3e 30%, #24243e 60%, #0f172a 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 30% 40%, rgba(168,85,247,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(52,211,153,0.12) 0%, transparent 40%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="auth-3d-scene mb-10" style={{ perspective: "1200px" }}>
            <div className="auth-chat-3d-container">
              <div className="auth-3d-chat-window">
                <div className="auth-3d-chat-header">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full"
                      style={{ background: "linear-gradient(135deg, #A855F7, #7C3AED)" }}
                    />
                    <div>
                      <div className="text-sm font-semibold text-white">Tars Chat</div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                        Online
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  </div>
                </div>
                <div className="auth-3d-chat-body">
                  <div className="auth-3d-msg-received">
                    <div className="auth-3d-msg-bubble-recv">Hey! Welcome to Tars Chat 👋</div>
                    <span className="text-[9px] text-white/30 mt-0.5">10:24 AM</span>
                  </div>
                  <div className="auth-3d-msg-sent">
                    <div className="auth-3d-msg-bubble-sent">Thanks! This looks amazing ✨</div>
                    <span className="text-[9px] text-white/30 mt-0.5 text-right">10:25 AM</span>
                  </div>
                  <div className="auth-3d-msg-received">
                    <div className="auth-3d-msg-bubble-recv">
                      Real-time messaging at its finest!
                      <span className="auth-3d-reaction">🔥 2</span>
                    </div>
                  </div>
                  <div className="auth-3d-msg-received">
                    <div className="auth-3d-msg-bubble-recv auth-3d-typing">
                      <span className="auth-3d-typing-dot" />
                      <span className="auth-3d-typing-dot" />
                      <span className="auth-3d-typing-dot" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="auth-3d-notif auth-3d-notif-1">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full"
                    style={{ background: "linear-gradient(135deg, #34D399, #059669)" }}
                  />
                  <div>
                    <div className="text-[10px] font-semibold text-white">New Message</div>
                    <div className="text-[9px] text-white/50">Sarah sent a photo</div>
                  </div>
                </div>
              </div>
              <div className="auth-3d-notif auth-3d-notif-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👍</span>
                  <div className="text-[10px] text-white/70">Alex reacted to your message</div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="font-display text-4xl xl:text-5xl font-bold text-white text-center leading-tight mb-3">
            Welcome <span style={{ color: "#C084FC" }}>Back</span>
          </h2>
          <p className="text-base text-white/50 text-center max-w-sm">
            Your conversations are waiting for you
          </p>
        </div>

        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-[11px] text-white/20 tracking-[0.2em] uppercase font-medium">
            Developed By Tars
          </p>
        </div>
      </div>

      {/* ====== RIGHT PANEL ====== */}
      <div className="relative flex w-full lg:w-[50%] xl:w-[45%] flex-col items-center justify-center auth-right-panel overflow-y-auto py-8">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-violet-200/30 dark:bg-violet-900/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-emerald-200/30 dark:bg-emerald-900/15 blur-3xl" />
        </div>

        {/* Custom branded title */}
        <div className="relative z-10 text-center mb-4">
          <div className="relative mx-auto mb-4 inline-flex">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl auth-icon-float"
              style={{
                background: "linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #34D399 100%)",
                boxShadow: "0 8px 24px rgba(168,85,247,0.35)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            Welcome back to{" "}
            <span className="gradient-text">Tars Chat</span>
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Sign in to pick up where you left off
          </p>
        </div>

        {/* Clerk original card - styled with colors only */}
        <div className="relative z-10">
          <SignIn
            appearance={{
              elements: {
                headerTitle: "!text-slate-800 dark:!text-white !font-display",
                headerSubtitle: "!text-slate-500 dark:!text-slate-400",
                socialButtonsBlockButton:
                  "hover:!bg-violet-50 dark:hover:!bg-violet-950/20 hover:!border-violet-300 dark:hover:!border-violet-600",
                formFieldInput:
                  "focus:!border-violet-400 dark:focus:!border-violet-500 focus:!ring-2 focus:!ring-violet-500/20",
                formButtonPrimary:
                  "!bg-gradient-to-r !from-violet-600 !via-purple-600 !to-violet-700 hover:!from-violet-700 hover:!via-purple-700 hover:!to-violet-800 !shadow-lg !shadow-violet-500/25 hover:!shadow-violet-500/35 !border-0",
                footerActionLink:
                  "!text-violet-600 dark:!text-violet-400 hover:!text-violet-700 !font-semibold",
                formFieldAction: "!text-violet-600 dark:!text-violet-400",
                identityPreviewEditButton: "!text-violet-600 dark:!text-violet-400",
              },
            }}
          />
        </div>

        {/* Footer */}
        <p className="relative z-10 mt-4 text-[11px] text-slate-400 dark:text-slate-500 text-center">
          By continuing, you agree to our{" "}
          <span className="text-violet-500 cursor-pointer hover:underline">Terms</span>
          {" & "}
          <span className="text-violet-500 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
}
