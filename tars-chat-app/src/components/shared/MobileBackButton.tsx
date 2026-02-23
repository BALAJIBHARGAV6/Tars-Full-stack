/* ========================================================
   BACK BUTTON - Navigation for Chat Views
   
   Shows a back arrow that navigates to the home/discover
   page. Visible on all screen sizes.
   ======================================================== */

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface MobileBackButtonProps {
  className?: string;
}

export default function MobileBackButton({ className }: MobileBackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    // Always navigate to the Discover People page
    router.push("/?view=discover");
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center justify-center rounded-xl p-2.5 text-slate-600 dark:text-slate-300 transition-all hover:bg-violet-50 dark:hover:bg-violet-900/30 hover:text-violet-600 dark:hover:text-violet-400 active:scale-95 ${className || ""}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
