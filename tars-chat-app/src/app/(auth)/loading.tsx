/* ========================================================
   AUTH LOADING - Smooth skeleton while pages load
   ======================================================== */

export default function AuthLoading() {
    return (
        <div className="flex min-h-screen w-full">
            {/* Left panel skeleton */}
            <div
                className="relative hidden lg:flex lg:w-[50%] xl:w-[55%] items-center justify-center"
                style={{
                    background: "linear-gradient(160deg, #0f0c29 0%, #1a0a3e 30%, #24243e 60%, #0f172a 100%)",
                }}
            >
                <div className="auth-loading-pulse">
                    <div
                        className="w-16 h-16 rounded-2xl"
                        style={{
                            background: "linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #34D399 100%)",
                            opacity: 0.6,
                        }}
                    />
                </div>
            </div>

            {/* Right panel skeleton */}
            <div className="relative flex w-full lg:w-[50%] xl:w-[45%] items-center justify-center auth-right-panel">
                <div className="auth-loading-pulse flex flex-col items-center gap-4">
                    <div
                        className="w-14 h-14 rounded-2xl"
                        style={{
                            background: "linear-gradient(135deg, #A855F7 0%, #7C3AED 50%, #34D399 100%)",
                            opacity: 0.4,
                        }}
                    />
                    <div className="w-48 h-5 rounded-lg bg-slate-200 dark:bg-slate-700" />
                    <div className="w-32 h-3 rounded-lg bg-slate-100 dark:bg-slate-800 mt-1" />
                    <div className="w-80 h-[300px] rounded-2xl bg-slate-100 dark:bg-slate-800/50 mt-4 border border-slate-200 dark:border-slate-700/50" />
                </div>
            </div>
        </div>
    );
}
