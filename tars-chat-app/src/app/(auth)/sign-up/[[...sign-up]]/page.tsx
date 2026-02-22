import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen w-full">
      {/* ====== LEFT PANEL - 3D Orbiting User Cards ====== */}
      <div
        className="relative hidden lg:flex lg:w-[50%] xl:w-[55%] flex-col items-center justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #020617 0%, #0c1222 25%, #0b1120 50%, #060d19 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 40% 35%, rgba(52,211,153,0.12) 0%, transparent 50%), radial-gradient(circle at 65% 75%, rgba(139,92,246,0.08) 0%, transparent 40%)",
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="auth-3d-scene mb-10" style={{ perspective: "1000px" }}>
            <div className="auth-signup-orbit-container">
              <div className="auth-signup-hub">
                <div className="auth-signup-hub-inner">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                </div>
                <div className="auth-signup-hub-ring auth-signup-hub-ring-1" />
                <div className="auth-signup-hub-ring auth-signup-hub-ring-2" />
                <div className="auth-signup-hub-ring auth-signup-hub-ring-3" />
              </div>

              <div className="auth-signup-card auth-signup-card-1">
                <div className="auth-signup-card-avatar" style={{ background: "linear-gradient(135deg, #F472B6, #EC4899)" }}>B</div>
                <div className="auth-signup-card-info">
                  <div className="text-[11px] font-semibold text-white">Balaji</div>
                  <div className="text-[9px] text-emerald-400">● Online</div>
                </div>
              </div>
              <div className="auth-signup-card auth-signup-card-2">
                <div className="auth-signup-card-avatar" style={{ background: "linear-gradient(135deg, #60A5FA, #3B82F6)" }}>C</div>
                <div className="auth-signup-card-info">
                  <div className="text-[11px] font-semibold text-white">Charan</div>
                  <div className="text-[9px] text-emerald-400">● Online</div>
                </div>
              </div>
              <div className="auth-signup-card auth-signup-card-3">
                <div className="auth-signup-card-avatar" style={{ background: "linear-gradient(135deg, #FBBF24, #F59E0B)" }}>A</div>
                <div className="auth-signup-card-info">
                  <div className="text-[11px] font-semibold text-white">Akshay</div>
                  <div className="text-[9px] text-white/40">2m ago</div>
                </div>
              </div>
              <div className="auth-signup-card auth-signup-card-4">
                <div className="auth-signup-card-avatar" style={{ background: "linear-gradient(135deg, #34D399, #10B981)" }}>V</div>
                <div className="auth-signup-card-info">
                  <div className="text-[11px] font-semibold text-white">Vaibhav</div>
                  <div className="text-[9px] text-emerald-400">● Online</div>
                </div>
              </div>

              <div className="auth-signup-connection auth-signup-conn-1" />
              <div className="auth-signup-connection auth-signup-conn-2" />
              <div className="auth-signup-connection auth-signup-conn-3" />
            </div>
          </div>

          <h2 className="font-display text-4xl xl:text-5xl font-bold text-white text-center leading-tight mb-3">
            Join the <span style={{ color: "#34D399" }}>Community</span>
          </h2>
          <p className="text-base text-white/50 text-center max-w-sm">
            Connect with thousands of users worldwide
          </p>
        </div>

        <div className="absolute bottom-6 left-0 right-0 text-center">
          <p className="text-[11px] text-white/20 tracking-[0.2em] uppercase font-medium">
            Developed By Tars
          </p>
        </div>
      </div>

      {/* ====== RIGHT PANEL ====== */}
      <div className="relative flex w-full lg:w-[50%] xl:w-[45%] flex-col items-center justify-start auth-right-panel overflow-y-auto py-10">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-emerald-200/30 dark:bg-emerald-900/15 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-violet-200/30 dark:bg-violet-900/15 blur-3xl" />
        </div>

        {/* Custom branded title */}
        <div className="relative z-10 text-center mb-4">
          <div className="relative mx-auto mb-4 inline-flex">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-2xl auth-icon-float"
              style={{
                background: "linear-gradient(135deg, #34D399 0%, #A855F7 50%, #7C3AED 100%)",
                boxShadow: "0 8px 24px rgba(52,211,153,0.3)",
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="22" y1="11" x2="16" y2="11" />
              </svg>
            </div>
          </div>
          <h1 className="font-display text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
            Join{" "}
            <span className="gradient-text">Tars Chat</span>
            {" "}today
          </h1>
          <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
            Create your account and start chatting
          </p>
          <div className="flex items-center justify-center gap-3 mt-2.5">
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure
            </div>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#A855F7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12,6 12,12 16,14" />
              </svg>
              Instant
            </div>
            <span className="text-slate-300 dark:text-slate-700">·</span>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
              </svg>
              Free
            </div>
          </div>
        </div>

        {/* Clerk original card - styled with colors only */}
        <div className="relative z-10">
          <SignUp
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
