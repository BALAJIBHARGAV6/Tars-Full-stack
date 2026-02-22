/* ========================================================
   MOBILE BACK BUTTON - Navigation for Mobile Views
   
   Shows a back arrow on mobile that navigates to the
   conversation list. Hidden on tablet and desktop.
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
    // Always go to the home/discover page
    router.push("/");
  };

  return (
    <button
      onClick={handleBack}
      className={`flex items-center justify-center rounded-xl p-2.5 text-slate-600 transition-all hover:bg-violet-50 hover:text-violet-600 active:scale-95 md:hidden ${className || ""}`}
      aria-label="Go back"
    >
      <ArrowLeft className="h-5 w-5" />
    </button>
  );
}
