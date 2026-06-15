"use client";

import { useEffect, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { useLenis } from "lenis/react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

const STAGE_SIZE = 900;
const ORBIT_DURATION = 45;

const LINE_RINGS = [279, 360, 450, 550] as const;

const SOLID_RINGS = [
  { r: 80, opacity: 0.6 },
  { r: 150, opacity: 0.5 },
  { r: 220, opacity: 0.4 },
] as const;

// lineIndex maps to orbitLineRefs: 0=innermost(r=279), 1=r360, 2=r450, 3=outermost(r=550)
const HERO_NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "Services", href: "#services" },
  { label: "Testimonial", href: "#testimonials" },
] as const;

const NAV_SCROLL_OFFSET = -80;

const ORBIT_TEXTS = [
  { label: "AI",         lineIndex: 0, startOffset: 0.0,  duration: 22 },
  { label: "OCR",        lineIndex: 2, startOffset: 0.2,  duration: 30 },
  { label: "Voice",      lineIndex: 1, startOffset: 0.55, duration: 26 },
  { label: "Whatsapp",   lineIndex: 3, startOffset: 0.75, duration: 36 },
  { label: "Visualizer", lineIndex: 2, startOffset: 0.4,  duration: 40 },
] as const;

/** Converts a circle radius (centered at SVG origin) to an SVG path string. */
const circlePath = (r: number) =>
  `M ${r},0 A ${r},${r} 0 1,1 -${r},0 A ${r},${r} 0 1,1 ${r},0 Z`;

export default function HeroAnimation() {
  const lenis = useLenis();
  const rootRef = useRef<HTMLDivElement>(null);
  const stageWrapRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const orbitMainRef = useRef<SVGSVGElement>(null);
  const orbitStageRef = useRef<SVGGElement>(null);
  const orbitBgRef = useRef<SVGRectElement>(null);
  const orbitLineRefs = useRef<(SVGCircleElement | null)[]>([]);
  const orbitGroupRefs = useRef<(SVGGElement | null)[]>([]);
  const orbitTextRefs = useRef<(SVGGElement | null)[]>([]);
  const navLinkRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    gsap.registerPlugin(MotionPathPlugin);

    const root = rootRef.current;
    const stageWrap = stageWrapRef.current;
    const spotlight = spotlightRef.current;
    const orbitMain = orbitMainRef.current;
    const orbitStage = orbitStageRef.current;
    if (!root || !stageWrap || !orbitMain || !orbitStage) return;

    const orbitGroups = orbitGroupRefs.current.filter(Boolean) as SVGGElement[];
    const orbitLines = orbitLineRefs.current.filter(Boolean) as SVGCircleElement[];
    const orbitTexts = orbitTextRefs.current.filter(Boolean) as SVGGElement[];
    const solids = orbitMain.querySelectorAll<SVGCircleElement>(".orbit-solid");
    const navLinks = navLinkRefs.current.filter(Boolean) as HTMLAnchorElement[];

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      gsap.set(orbitStage, { opacity: 1, x: 0, y: 0, rotation: 0 });
      gsap.set(orbitMain, { autoAlpha: 1 });
      const spotlightGlow = spotlight?.querySelector<HTMLElement>(".hero-spotlight-glow");
      if (spotlight && spotlightGlow) {
        gsap.set(spotlightGlow, {
          opacity: 0,
          scaleX: 0.85,
          scaleY: 0.85,
        });
      }

      orbitTextRefs.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, {
          opacity: 0,
          transformOrigin: "50% 50%",
          svgOrigin: "50% 50%",
        });
      });

      if (navLinks.length > 0) {
        gsap.set(navLinks, { opacity: 0, x: -28 });
        navLinks.forEach((link) => {
          const line = link.querySelector<HTMLElement>(".hero-nav-line");
          const label = link.querySelector<HTMLElement>(".hero-nav-label");
          if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });
          if (label) gsap.set(label, { x: 0 });
        });
      }

      const tl = gsap.timeline({ defaults: { duration: ORBIT_DURATION } });

      tl.from(orbitMain, { duration: 1, autoAlpha: 0, ease: "power1.inOut" }, 0)
        .fromTo(
          orbitGroups,
          { opacity: 0 },
          { duration: 0.3, opacity: 1, stagger: -0.1 },
          0,
        )
        .from(
          orbitGroups,
          {
            duration: 2.5,
            scaleX: -0.3,
            scaleY: -0.3,
            transformOrigin: "50% 50%",
            stagger: -0.05,
            ease: "elastic",
          },
          0,
        )
        .fromTo(
          orbitBgRef.current,
          { opacity: 0 },
          { duration: 1, opacity: 1, ease: "power2.inOut" },
          0.2,
        );

      if (navLinks.length > 0) {
        tl.to(
          navLinks,
          {
            opacity: 1,
            x: 0,
            duration: 0.75,
            stagger: 0.12,
            ease: "power3.out",
          },
          0.55,
        );
      }

      tl.add("orbs", 1.2);

      ORBIT_TEXTS.forEach((item, i) => {
        const el = orbitTextRefs.current[i];
        if (!el) return;

        const r = LINE_RINGS[item.lineIndex];
        const path = circlePath(r);

        tl.to(el, { opacity: 1, duration: 0.6, ease: "power2.out" }, "orbs");

        if (!reducedMotion) {
          gsap.to(el, {
            motionPath: {
              path,
              alignOrigin: [0.5, 0.5],
              autoRotate: false,
              start: item.startOffset,
              end: item.startOffset + 1,
            },
            ease: "none",
            repeat: -1,
            duration: item.duration,
            delay: 1.2,
          });
        }
      });

      if (!reducedMotion) {
        gsap.to(orbitLines, {
          attr: { "stroke-width": "+=0.6" },
          opacity: "+=0.12",
          duration: 3.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: { each: 0.35, from: "center" },
          delay: 2.5,
        });

        gsap.to(solids, {
          opacity: "+=0.08",
          duration: 4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.4,
          delay: 2,
        });
      }

      const quickStageX = gsap.quickTo(orbitStage, "x", {
        duration: 0.9,
        ease: "power3.out",
      });
      const quickStageY = gsap.quickTo(orbitStage, "y", {
        duration: 0.9,
        ease: "power3.out",
      });
      const quickStageRot = gsap.quickTo(orbitStage, "rotation", {
        duration: 1.1,
        ease: "power3.out",
      });
      const quickSpotX = spotlight
        ? gsap.quickTo(spotlight, "x", { duration: 0.55, ease: "power2.out" })
        : null;
      const quickSpotY = spotlight
        ? gsap.quickTo(spotlight, "y", { duration: 0.55, ease: "power2.out" })
        : null;
      const quickSpotOpacity =
        spotlight && spotlightGlow
          ? gsap.quickTo(spotlightGlow, "opacity", {
              duration: 0.45,
              ease: "power2.out",
            })
          : null;
      const quickSpotScaleX =
        spotlight && spotlightGlow
          ? gsap.quickTo(spotlightGlow, "scaleX", {
              duration: 0.6,
              ease: "power2.out",
            })
          : null;
      const quickSpotScaleY =
        spotlight && spotlightGlow
          ? gsap.quickTo(spotlightGlow, "scaleY", {
              duration: 0.6,
              ease: "power2.out",
            })
          : null;

      const groupQuickSets = orbitGroups.map((group, index) => ({
        x: gsap.quickTo(group, "x", {
          duration: 0.85 + index * 0.04,
          ease: "power3.out",
        }),
        y: gsap.quickTo(group, "y", {
          duration: 0.85 + index * 0.04,
          ease: "power3.out",
        }),
      }));

      let hasPointer = false;

      const onMove = (e: MouseEvent) => {
        const rect = stageWrap.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;

        if (!hasPointer) {
          hasPointer = true;
          quickSpotOpacity?.(0.75);
          quickSpotScaleX?.(1);
          quickSpotScaleY?.(1);
        }

        quickStageX(nx * 28);
        quickStageY(ny * 20);
        quickStageRot(nx * 2.2);

        orbitGroups.forEach((group, index) => {
          const depth = index + 1;
          groupQuickSets[index]?.x((nx / depth) * 110);
          groupQuickSets[index]?.y((ny / depth) * -48);
        });

        gsap.to([...solids, ...orbitLines], {
          duration: 0.9,
          attr: { opacity: Math.min(1, 0.92 - ny * 0.35) },
          overwrite: "auto",
        });

        if (spotlight && quickSpotX && quickSpotY) {
          const rootRect = root.getBoundingClientRect();
          quickSpotX(e.clientX - rootRect.left);
          quickSpotY(e.clientY - rootRect.top);
        }

        orbitTexts.forEach((textEl) => {
          const textNode = textEl.querySelector("text");
          if (!textEl || !textNode) return;

          const textRect = textNode.getBoundingClientRect();
          const textCx = textRect.left + textRect.width / 2;
          const textCy = textRect.top + textRect.height / 2;
          const dist = Math.hypot(e.clientX - textCx, e.clientY - textCy);
          const proximity = Math.max(0, 1 - dist / 220);

          gsap.to(textEl, {
            opacity: 0.72 + proximity * 0.28,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
          gsap.to(textNode, {
            attr: { "font-size": 13 + proximity * 3.5 },
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      };

      const onLeave = () => {
        hasPointer = false;
        quickSpotOpacity?.(0);
        quickSpotScaleX?.(0.85);
        quickSpotScaleY?.(0.85);
        quickStageX(0);
        quickStageY(0);
        quickStageRot(0);

        orbitGroups.forEach((_, index) => {
          groupQuickSets[index]?.x(0);
          groupQuickSets[index]?.y(0);
        });

        gsap.to(orbitTexts, {
          opacity: 1,
          duration: 0.6,
          ease: "power2.out",
          overwrite: "auto",
        });
        orbitTexts.forEach((textEl) => {
          const textNode = textEl.querySelector("text");
          if (textNode) {
            gsap.to(textNode, {
              attr: { "font-size": 13 },
              duration: 0.6,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });
      };

      const onClick = () => {
        orbitGroups.forEach((group, i) => {
          gsap.fromTo(
            group,
            { transformOrigin: "50% 50%", scaleX: 1, scaleY: 1 },
            {
              duration: 0.55 - i / 30,
              scaleX: 0.93,
              scaleY: 0.93,
              ease: "back.in(4)",
              yoyo: true,
              repeat: 1,
            },
          );
        });

        orbitLines.forEach((line, lineIndex) => {
          const baseWidth = Number(line.getAttribute("stroke-width") ?? 2);
          gsap.fromTo(
            line,
            { attr: { "stroke-width": baseWidth } },
            {
              attr: { "stroke-width": baseWidth + 2 },
              duration: 0.25,
              delay: lineIndex * 0.04,
              yoyo: true,
              repeat: 1,
              ease: "power2.inOut",
            },
          );
        });
      };

      const navHandlers = navLinks.map((link) => {
        const line = link.querySelector<HTMLElement>(".hero-nav-line");
        const label = link.querySelector<HTMLElement>(".hero-nav-label");

        const onEnter = () => {
          gsap.to(link, { x: 10, duration: 0.4, ease: "power3.out", overwrite: "auto" });
          if (label) {
            gsap.to(label, {
              color: "rgba(255,255,255,1)",
              letterSpacing: "0.08em",
              duration: 0.35,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
          if (line) {
            gsap.to(line, {
              scaleX: 1,
              duration: 0.45,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        const onLeave = () => {
          gsap.to(link, { x: 0, duration: 0.45, ease: "power2.out", overwrite: "auto" });
          if (label) {
            gsap.to(label, {
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.04em",
              duration: 0.4,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
          if (line) {
            gsap.to(line, {
              scaleX: 0,
              duration: 0.35,
              ease: "power2.inOut",
              overwrite: "auto",
            });
          }
        };

        const onDown = () => {
          gsap.to(link, {
            x: 6,
            scaleX: 0.98,
            scaleY: 0.98,
            duration: 0.12,
            ease: "power2.in",
            overwrite: "auto",
          });
        };

        const onUp = () => {
          gsap.to(link, {
            x: 10,
            scaleX: 1,
            scaleY: 1,
            duration: 0.25,
            ease: "back.out(2)",
            overwrite: "auto",
          });
        };

        link.addEventListener("mouseenter", onEnter);
        link.addEventListener("mouseleave", onLeave);
        link.addEventListener("focus", onEnter);
        link.addEventListener("blur", onLeave);
        link.addEventListener("mousedown", onDown);
        link.addEventListener("mouseup", onUp);

        return () => {
          link.removeEventListener("mouseenter", onEnter);
          link.removeEventListener("mouseleave", onLeave);
          link.removeEventListener("focus", onEnter);
          link.removeEventListener("blur", onLeave);
          link.removeEventListener("mousedown", onDown);
          link.removeEventListener("mouseup", onUp);
        };
      });

      stageWrap.addEventListener("mousemove", onMove);
      stageWrap.addEventListener("mouseleave", onLeave);
      stageWrap.addEventListener("click", onClick);

      return () => {
        stageWrap.removeEventListener("mousemove", onMove);
        stageWrap.removeEventListener("mouseleave", onLeave);
        stageWrap.removeEventListener("click", onClick);
        navHandlers.forEach((cleanup) => cleanup());
      };
    }, root);

    return () => ctx.revert();
  }, []);

  const handleNavClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    event.preventDefault();
    if (!lenis) return;

    lenis.scrollTo(href, { offset: NAV_SCROLL_OFFSET });
  };

  return (
    <section
      ref={rootRef}
      className="relative min-h-screen w-full bg-[#05070a]"
    >
      <nav
        aria-label="Hero navigation"
        className="absolute left-8 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-7 sm:left-12 md:gap-8"
      >
        {HERO_NAV_LINKS.map((link, index) => (
          <a
            key={link.label}
            ref={(el) => {
              navLinkRefs.current[index] = el;
            }}
            href={link.href}
            onClick={(event) => handleNavClick(event, link.href)}
            className="hero-nav-link group relative inline-flex items-center pl-5 outline-none will-change-transform focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#05070a]"
          >
            <span
              className="hero-nav-line absolute left-0 top-1/2 h-px w-6 -translate-y-1/2 bg-gradient-to-r from-blue-400 to-indigo-400"
              aria-hidden
            />
            <span className="hero-nav-label font-[family-name:var(--font-heading)] text-lg font-bold tracking-[0.04em] text-white/70 md:text-2xl">
              {link.label}
            </span>
          </a>
        ))}
      </nav>

      <div
        ref={spotlightRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-[5] will-change-transform"
      >
        <div
          className="hero-spotlight-glow h-[min(520px,70vw)] w-[min(520px,70vw)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 will-change-[transform,opacity]"
          style={{
            background:
              "radial-gradient(circle, rgba(96,165,250,0.14) 0%, rgba(129,140,248,0.06) 38%, transparent 72%)",
          }}
        />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_55%)]"
      />
      <div
        ref={stageWrapRef}
        className="pointer-events-auto absolute inset-0 z-10 h-full w-full"
      >
        <svg
          ref={orbitMainRef}
          className="orbit-main block h-full w-full overflow-visible"
          width="100%"
          height="100%"
          viewBox={`${-STAGE_SIZE / 2} ${-STAGE_SIZE / 2} ${STAGE_SIZE} ${STAGE_SIZE}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          <defs>
            <clipPath id="logo-circle-clip">
              <circle cx={0} cy={0} r={100} />
            </clipPath>
            <radialGradient id="logo-border-fade" cx="50%" cy="50%" r="50%">
              <stop offset="70%" stopColor="#60a5fa" stopOpacity={0} />
              <stop offset="88%" stopColor="#60a5fa" stopOpacity={0.55} />
              <stop offset="100%" stopColor="#818cf8" stopOpacity={0} />
            </radialGradient>
            <linearGradient
              id="orbit-grad1"
              gradientUnits="userSpaceOnUse"
              x1={0}
              y1={-STAGE_SIZE / 2}
              x2={0}
              y2={STAGE_SIZE / 2}
            >
              <stop offset="10%" stopColor="#60a5fa" stopOpacity={0.9} />
              <stop offset="99%" stopColor="#818cf8" stopOpacity={0.35} />
            </linearGradient>
            <radialGradient
              id="orbit-grad2"
              gradientUnits="userSpaceOnUse"
              cx={0}
              cy={0}
              r={STAGE_SIZE / 2}
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity={0.06} />
              <stop offset="55%" stopColor="#ffffff" stopOpacity={0} />
              <stop offset="100%" stopColor="#05070a" stopOpacity={0} />
            </radialGradient>
          </defs>

          <rect
            ref={orbitBgRef}
            className="orbit-bg"
            fill="url(#orbit-grad2)"
            x={-STAGE_SIZE / 2}
            y={-STAGE_SIZE / 2}
            width={STAGE_SIZE}
            height={STAGE_SIZE}
            opacity={0}
          />

          <g ref={orbitStageRef} className="orbit-stage">
            <g
              ref={(el) => {
                orbitGroupRefs.current[0] = el;
              }}
              className="orbit-c-group"
            >
              <circle
                ref={(el) => {
                  orbitLineRefs.current[3] = el;
                }}
                className="orbit-line c1_line4"
                cx={0}
                cy={0}
                r={LINE_RINGS[3]}
                fill="none"
                strokeWidth={2}
                stroke="url(#orbit-grad1)"
                opacity={0.55}
              />
            </g>

            <g
              ref={(el) => {
                orbitGroupRefs.current[1] = el;
              }}
              className="orbit-c-group"
            >
              <circle
                ref={(el) => {
                  orbitLineRefs.current[2] = el;
                }}
                className="orbit-line c1_line3"
                cx={0}
                cy={0}
                r={LINE_RINGS[2]}
                fill="none"
                strokeWidth={2}
                stroke="url(#orbit-grad1)"
                opacity={0.55}
              />
            </g>

            <g
              ref={(el) => {
                orbitGroupRefs.current[2] = el;
              }}
              className="orbit-c-group"
            >
              <circle
                ref={(el) => {
                  orbitLineRefs.current[1] = el;
                }}
                className="orbit-line c1_line2"
                cx={0}
                cy={0}
                r={LINE_RINGS[1]}
                fill="none"
                strokeWidth={2}
                stroke="url(#orbit-grad1)"
                opacity={0.6}
              />
            </g>

            <g
              ref={(el) => {
                orbitGroupRefs.current[3] = el;
              }}
              className="orbit-c-group"
            >
              <circle
                className="orbit-solid c1_solid"
                cx={0}
                cy={0}
                r={LINE_RINGS[0]}
                fill="url(#orbit-grad1)"
                opacity={0.25}
              />
              <circle
                ref={(el) => {
                  orbitLineRefs.current[0] = el;
                }}
                className="orbit-line c1_line1"
                cx={0}
                cy={0}
                r={LINE_RINGS[0]}
                fill="none"
                strokeWidth={3}
                stroke="url(#orbit-grad1)"
                opacity={0.65}
              />
            </g>

            {SOLID_RINGS.map((ring, i) => (
              <g
                key={ring.r}
                ref={(el) => {
                  orbitGroupRefs.current[4 + i] = el;
                }}
                className="orbit-c-group"
              >
                <circle
                  className="orbit-solid c1_solid"
                  cx={0}
                  cy={0}
                  r={ring.r}
                  fill="url(#orbit-grad1)"
                  opacity={ring.opacity}
                />
              </g>
            ))}

            {/* Logo centered in the orbit */}
            <image
              href="/logo.png"
              x={-100}
              y={-100}
              width={200}
              height={200}
              preserveAspectRatio="xMidYMid meet"
              clipPath="url(#logo-circle-clip)"
              style={{ filter: "drop-shadow(0 0 18px rgba(96,165,250,0.5))" }}
            />
            {/* Faded border ring around logo */}
            <circle
              cx={0}
              cy={0}
              r={100}
              fill="url(#logo-border-fade)"
              stroke="none"
            />
          </g>

          {ORBIT_TEXTS.map((item, i) => (
            <g
              key={item.label}
              ref={(el) => {
                orbitTextRefs.current[i] = el;
              }}
              className="orbit-text cursor-default"
              opacity={0}
            >
              <text
                className="orbit-text-node"
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(224,231,255,0.95)"
                fontSize={13}
                fontWeight={600}
                letterSpacing="0.18em"
                style={{
                  textTransform: "uppercase",
                  filter: "drop-shadow(0 0 8px rgba(96,165,250,0.85))",
                }}
              >
                {item.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
