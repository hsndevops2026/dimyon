"use client";

import { Calendar } from "lucide-react";
import { openCalendlyPopup } from "@/lib/calendly";

const CALENDLY_URL = process.env.NEXT_PUBLIC_CALENDLY_URL ?? "https://calendly.com/indoethnichub/30min";

export default function BookACallButton() {
  const handleClick = () => {
    openCalendlyPopup(CALENDLY_URL);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Book a call"
      className="group relative inline-flex items-center rounded-full bg-gradient-to-r from-blue-400/80 to-indigo-400/80 p-px shadow-[0_0_20px_rgba(96,165,250,0.12)] outline-none transition-[transform,box-shadow] duration-300 hover:scale-[1.02] hover:from-blue-400 hover:to-indigo-400 hover:shadow-[0_0_28px_rgba(96,165,250,0.28)] focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070a]"
    >
      <span className="inline-flex items-center gap-2 rounded-full bg-[#05070a]/90 px-5 py-2.5 text-sm font-semibold tracking-wide text-white backdrop-blur-sm transition-colors duration-300 group-hover:bg-[#05070a]/70">
        <Calendar
          className="h-3.5 w-3.5 text-blue-400 transition-colors duration-300 group-hover:text-blue-300"
          aria-hidden
        />
        Book a Call
      </span>
    </button>
  );
}
