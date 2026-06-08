"use client";

import { TextHoverEffect } from "@/components/ui/text-hover-effect";

export function TextHoverEffectBackground({
  text = "Dimyon",
  className,
  cursor,
  hovered,
}: {
  text?: string;
  className?: string;
  cursor?: { x: number; y: number };
  hovered?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className ?? ""}`}
    >
      <div className="absolute opacity-70 inset-x-0 bottom-0 h-[18rem] w-full sm:h-[22rem] lg:h-[26rem]">
        <TextHoverEffect
          text={text}
          cursor={cursor}
          hovered={hovered}
        />
      </div>
    </div>
  );
}

export default function TextHoverEffectDemo() {
  return (
    <div className="flex h-[40rem] items-center justify-center">
      <TextHoverEffect text="Dimyon" />
    </div>
  );
}
