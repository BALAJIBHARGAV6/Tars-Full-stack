/* ========================================================
   404 NOT FOUND PAGE
   ======================================================== */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-violet-50 via-white to-green-50">
      <div className="text-center">
        <h1 className="font-display text-6xl font-bold gradient-text">404</h1>
        <h2 className="mt-4 font-display text-xl font-semibold text-slate-800">
          Page not found
        </h2>
        <p className="mt-2 text-slate-500">
          The page you are looking for does not exist.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-violet-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
