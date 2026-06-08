import Link from "next/link";

function DimyonLogo() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <circle
        cx="20"
        cy="20"
        r="18"
        stroke="url(#navbar-logo-ring)"
        strokeWidth="1.5"
        opacity="0.85"
      />
      <circle
        cx="20"
        cy="20"
        r="13"
        stroke="url(#navbar-logo-ring)"
        strokeWidth="1"
        opacity="0.55"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="18"
        ry="6"
        stroke="url(#navbar-logo-ring)"
        strokeWidth="1"
        opacity="0.45"
        transform="rotate(35 20 20)"
      />
      <ellipse
        cx="20"
        cy="20"
        rx="18"
        ry="6"
        stroke="url(#navbar-logo-ring)"
        strokeWidth="1"
        opacity="0.45"
        transform="rotate(-35 20 20)"
      />
      <defs>
        <linearGradient id="navbar-logo-ring" x1="4" y1="4" x2="36" y2="36">
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

export default function Navbar() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Main navigation"
        className="pointer-events-auto mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          aria-label="Dimyon home"
        >
          <span className="text-white bg-clip-text text-xl font-bold tracking-tight text-transparent">
            Dimyon
          </span>
        </Link>

        <div className="flex items-center gap-6 sm:gap-8">
          <a
            href="https://wa.me/972525400579"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-white/15 bg-white/5 px-5 py-2 text-sm font-medium text-white transition-colors hover:border-white/30 hover:bg-white/10"
          >
            Book a Call
          </a>
        </div>
      </nav>
    </header>
  );
}
