"use client";

import Link from "next/link";
import { useState } from "react";
import { TextHoverEffectBackground } from "@/components/text-hover-effect-demo";

const QUICK_LINKS = [
  { label: "Home", href: "#" },
  { label: "Why AI Orbit", href: "#why-ai-orbit" },
  { label: "Our services", href: "#services" },
  { label: "Interactive catalog", href: "#catalog" },
  { label: "Watch the demo", href: "#demo" },
  { label: "Book a free trial", href: "#trial" },
] as const;

const SOCIAL_LINKS = [
  {
    label: "WhatsApp",
    href: "https://wa.me/972525400579",
    icon: (
      <path
        d="M8 2.5a5.5 5.5 0 0 0-4.8 8.2L2 14l3.4-1.1A5.5 5.5 0 1 0 8 2.5Zm0 1a4.5 4.5 0 0 1 3.9 6.7l.2.4-.2 1.8-1.8-.6-.4.2A4.5 4.5 0 1 1 8 3.5Zm-1.6 2.1c.1-.2.3-.3.5-.3.2 0 .4 0 .6.3.2.3.7 1 .8 1.1.1.1.1.3 0 .4-.1.2-.5.6-.6.7-.1.1-.2.2-.1.4.1.2.5 1 1.2 1.6.8.7 1.5.9 1.7 1 .2.1.3 0 .4-.1.1-.1.4-.5.5-.7.1-.2.3-.2.5-.1.2.1 1.2.6 1.4.7.2.1.3.2.3.4 0 .2-.1.9-.5 1.3-.4.4-1 .6-1.4.6-.4 0-.9-.1-1.5-.4-1.6-.7-2.7-1.7-3.5-3.1-.8-1.4-1.2-2.6-1.1-3.7 0-.5.2-1 .6-1.3Z"
        fill="currentColor"
      />
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <path
        d="M4.5 5.5h2.2v8H4.5v-8Zm1.1-3.5a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6ZM8.8 9.2c0-1 .2-1.8 1.5-1.8 1.3 0 1.3 1.5 1.3 2.6v3.5H10v-3.1c0-.7 0-1.7-1-1.7s-1.2.8-1.2 1.7v3.1H8.8V9.2Z"
        fill="currentColor"
      />
    ),
  },
  {
    label: "Facebook",
    href: "https://facebook.com",
    icon: (
      <path
        d="M10.5 4h-2c-1.4 0-2.5 1.1-2.5 2.5V8H4v2.2h2v5.8h2.2v-5.8H11l.4-2.2H8.2V6.7c0-.4.3-.7.7-.7h1.6V4Z"
        fill="currentColor"
      />
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (
      <>
        <rect
          x="3.8"
          y="3.8"
          width="8.4"
          height="8.4"
          rx="2.2"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <circle cx="11.2" cy="4.8" r="0.6" fill="currentColor" />
      </>
    ),
  },
] as const;

function DimyonLogo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <circle cx="20" cy="20" r="18" stroke="url(#footer-logo-ring)" strokeWidth="1.5" opacity="0.85" />
      <circle cx="20" cy="20" r="13" stroke="url(#footer-logo-ring)" strokeWidth="1" opacity="0.55" />
      <ellipse cx="20" cy="20" rx="18" ry="6" stroke="url(#footer-logo-ring)" strokeWidth="1" opacity="0.45" transform="rotate(35 20 20)" />
      <ellipse cx="20" cy="20" rx="18" ry="6" stroke="url(#footer-logo-ring)" strokeWidth="1" opacity="0.45" transform="rotate(-35 20 20)" />
      <defs>
        <linearGradient id="footer-logo-ring" x1="4" y1="4" x2="36" y2="36">
          <stop stopColor="#60a5fa" />
          <stop offset="1" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <text
        x="20"
        y="21"
        textAnchor="middle"
        dominantBaseline="central"
        fill="white"
        fontSize="14"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
      >
        D
      </text>
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  return (
    <footer
      className="relative overflow-hidden bg-[#05070a] text-white pt-10"
      onMouseMove={(event) =>
        setCursor({ x: event.clientX, y: event.clientY })
      }
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* <TextHoverEffectBackground
        text="Dimyon"
        className="opacity-[0.2]"
        cursor={cursor}
        hovered={hovered}
      /> */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-64 bg-[radial-gradient(ellipse_at_bottom,rgba(96,165,250,0.22)_0%,transparent_70%)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 sm:px-10 lg:px-12">
        <div className="grid gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
          {/* Contact */}
          <div>
            <h2 className="mb-5 text-sm font-semibold tracking-[0.2em] text-white">
              CONTACT US
            </h2>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <a
                  href="mailto:Dimyon.net@gmail.com"
                  className="transition-colors hover:text-white"
                >
                  Dimyon.net@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+972525400579"
                  className="transition-colors hover:text-white"
                >
                  +972 52 540 0579
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:text-right">
            <h2 className="mb-5 text-sm font-semibold tracking-[0.2em] text-white">
              QUICK LINKS
            </h2>
            <nav aria-label="Quick links">
              <ul className="space-y-2 text-sm text-slate-400">
                {QUICK_LINKS.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Brand & Socials */}
          <div className="flex flex-col items-start md:items-end">
            <div className="mb-4 flex items-center gap-3">
              <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-2xl font-bold tracking-tight text-transparent">
                Dimyon
              </span>
              <DimyonLogo />
            </div>

            <p className="mb-6 max-w-xs text-right text-sm leading-relaxed text-slate-400 md:text-right">
              Dimyon — We accompany your client every step of the way
            </p>

            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-600/80 text-slate-400 transition-colors hover:border-slate-400 hover:text-white"
                >
                  <svg
                    viewBox="0 0 16 16"
                    className="h-4 w-4"
                    aria-hidden
                  >
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
