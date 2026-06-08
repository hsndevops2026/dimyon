"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { LucideIcon } from "lucide-react";
import {
  Bot,
  CalendarCheck,
  FileText,
  Home,
  Phone,
  Sheet,
  ScanEye,
  Sparkles,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type WorkflowStep = {
  icon: LucideIcon;
  label: string;
  accent?: string;
};

type Workflow = {
  title: string;
  steps: WorkflowStep[];
};

const WORKFLOWS: Workflow[] = [
  {
    title: "Turn invoices into structured data automatically.",
    steps: [
      { icon: FileText, label: "Invoice" },
      { icon: Bot, label: "AI Extraction", accent: "#60a5fa" },
      { icon: Sheet, label: "Excel Dashboard", accent: "#34d399" },
    ],
  },
  {
    title: "Answer calls and book appointments without manual work.",
    steps: [
      { icon: Phone, label: "Customer Call" },
      { icon: Bot, label: "AI Agent", accent: "#60a5fa" },
      { icon: CalendarCheck, label: "Appointment Booked", accent: "#34d399" },
    ],
  },
  {
    title: "Visualize empty spaces into finished designs instantly.",
    steps: [
      { icon: Home, label: "Empty Room" },
      { icon: ScanEye, label: "AI Visualizer", accent: "#60a5fa" },
      { icon: Sparkles, label: "Finished Design", accent: "#fbbf24" },
    ],
  },
];

function IsometricBlock({
  icon: Icon,
  label,
  accent,
  blockRef,
}: {
  icon: LucideIcon;
  label: string;
  accent?: string;
  blockRef?: (el: HTMLDivElement | null) => void;
}) {
  const glow = accent ?? "rgba(255,255,255,0.12)";
  const ellipseTop = 26 - 8;
  const iconTop = ellipseTop - 20 - 3;

  return (
    <div
      ref={blockRef}
      className="iso-block flex cursor-pointer flex-col items-center opacity-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12151c]"
      tabIndex={0}
      role="group"
      aria-label={label}
    >
      <div
        className="iso-platform relative will-change-transform"
        style={{ width: 88, height: 72 }}
      >
        <svg
          viewBox="0 0 88 72"
          className="iso-platform-svg h-full w-full overflow-visible"
          aria-hidden
        >
          <polygon
            className="iso-face-top"
            points="44,8 76,26 44,44 12,26"
            fill="#1f2937"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
          <polygon
            className="iso-face-left"
            points="12,26 44,44 44,64 12,46"
            fill="#111827"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <polygon
            className="iso-face-right"
            points="44,44 76,26 76,46 44,64"
            fill="#0f172a"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <ellipse
            cx="44"
            cy="26"
            rx="18"
            ry="8"
            fill={glow}
            opacity="0.35"
            className="iso-glow"
          />
        </svg>
        <Icon
          className="iso-icon absolute left-1/2 h-5 w-5 -translate-x-1/2 text-white/90 will-change-transform"
          style={{ top: iconTop }}
          strokeWidth={1.75}
          aria-hidden
        />
      </div>
      <span className="iso-label mt-2 text-center text-xs font-medium tracking-wide text-white/80 will-change-transform">
        {label}
      </span>
    </div>
  );
}

function FlowArrow({ arrowRef }: { arrowRef?: (el: HTMLDivElement | null) => void }) {
  return (
    <div
      ref={arrowRef}
      className="iso-arrow flex h-12 items-center justify-center opacity-0"
      aria-hidden
    >
      <svg width="24" height="40" viewBox="0 0 24 40" className="overflow-visible">
        <line
          x1="12"
          y1="3"
          x2="12"
          y2="28"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="2"
          strokeLinecap="round"
          className="iso-arrow-line"
        />
        <circle
          cx="12"
          cy="8"
          r="2.5"
          fill="#60a5fa"
          className="iso-flow-dot"
          opacity="0"
        />
        <polygon
          points="12,34 7,25 17,25"
          fill="rgba(255,255,255,0.55)"
          className="iso-arrow-head"
        />
      </svg>
    </div>
  );
}

function WorkflowCard({
  workflow,
  index,
}: {
  workflow: Workflow;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const arrowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const card = cardRef.current;
    const blocks = blockRefs.current.filter(Boolean) as HTMLDivElement[];
    const arrows = arrowRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!card || blocks.length === 0) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set([...blocks, ...arrows], { opacity: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(card, { opacity: 0, y: 40 });
      gsap.set(blocks, { opacity: 0, y: -18, scale: 0.88 });
      gsap.set(arrows, { opacity: 0, scaleY: 0.4, transformOrigin: "50% 0%" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: card,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
        delay: index * 0.15,
      });

      tl.to(card, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      });

      workflow.steps.forEach((_, stepIndex) => {
        const block = blocks[stepIndex];
        const arrow = arrows[stepIndex];

        tl.to(
          block,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: "back.out(1.6)",
          },
          stepIndex === 0 ? "-=0.2" : "+=0.1",
        );

        if (block) {
          tl.to(
            block.querySelector(".iso-glow"),
            {
              opacity: 0.65,
              scale: 1.15,
              duration: 0.45,
              ease: "power2.out",
              transformOrigin: "50% 50%",
            },
            "<+=0.1",
          );
        }

        if (arrow) {
          tl.to(
            arrow,
            {
              opacity: 1,
              scaleY: 1,
              duration: 0.35,
              ease: "power2.out",
            },
            "+=0.08",
          );
        }
      });

      gsap.to(card.querySelectorAll(".iso-glow"), {
        opacity: 0.45,
        scale: 1.05,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
        delay: 1.5 + index * 0.2,
      });

      gsap.to(arrows, {
        y: 4,
        duration: 1.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.2,
        delay: 2 + index * 0.15,
      });

      arrows.forEach((arrow, arrowIndex) => {
        const dot = arrow.querySelector(".iso-flow-dot");
        if (!dot) return;

        gsap
          .timeline({
            repeat: -1,
            delay: 2.2 + arrowIndex * 0.55 + index * 0.1,
          })
          .set(dot, { opacity: 0, attr: { cy: 8 } })
          .to(dot, { opacity: 1, duration: 0.18 })
          .to(dot, {
            attr: { cy: 28 },
            duration: 1.05,
            ease: "power1.inOut",
          })
          .to(dot, { opacity: 0, duration: 0.18 });
      });
    }, card);

    return () => ctx.revert();
  }, [index, workflow.steps]);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    const scene = card.querySelector<HTMLElement>(".iso-scene");
    const blocks = card.querySelectorAll<HTMLElement>(".iso-block");
    const title = card.querySelector<HTMLElement>(".workflow-title");
    const floor = card.querySelector<SVGElement>(".iso-floor");

    const resetBlock = (block: HTMLElement) => {
      const platform = block.querySelector<HTMLElement>(".iso-platform");
      const icon = block.querySelector<HTMLElement>(".iso-icon");
      const glow = block.querySelector<SVGElement>(".iso-glow");
      const label = block.querySelector<HTMLElement>(".iso-label");
      const faces = block.querySelectorAll<SVGElement>(".iso-face-top, .iso-face-left, .iso-face-right");

      if (platform) {
        gsap.to(platform, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (icon) {
        gsap.to(icon, {
          y: 0,
          scale: 1,
          rotate: 0,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (glow) {
        gsap.to(glow, {
          opacity: 0.35,
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (label) {
        gsap.to(label, {
          y: 0,
          color: "rgba(255,255,255,0.8)",
          duration: 0.35,
          overwrite: "auto",
        });
      }
      const topFace = block.querySelector<SVGElement>(".iso-face-top");
      const sideFaces = block.querySelectorAll<SVGElement>(
        ".iso-face-left, .iso-face-right",
      );
      if (topFace) {
        gsap.to(topFace, {
          stroke: "rgba(255,255,255,0.12)",
          duration: 0.35,
          overwrite: "auto",
        });
      }
      gsap.to(sideFaces, {
        stroke: "rgba(255,255,255,0.08)",
        duration: 0.35,
        overwrite: "auto",
      });

      const arrow = block.nextElementSibling;
      if (arrow?.classList.contains("iso-arrow")) {
        gsap.to(arrow.querySelector(".iso-arrow-line"), {
          stroke: "rgba(255,255,255,0.18)",
          duration: 0.3,
          overwrite: "auto",
        });
        gsap.to(arrow.querySelector(".iso-flow-dot"), {
          attr: { r: 2.5 },
          duration: 0.3,
          overwrite: "auto",
        });
      }
    };

    const onCardEnter = () => {
      gsap.to(card, {
        y: -10,
        scale: 1.018,
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
      if (title) {
        gsap.to(title, {
          color: "rgba(255,255,255,1)",
          x: 4,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (floor) {
        gsap.to(floor, {
          opacity: 0.65,
          scale: 1.04,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
    };

    const onCardLeave = () => {
      gsap.to(card, {
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: "power2.out",
        overwrite: "auto",
      });
      if (scene) {
        gsap.to(scene, {
          x: 0,
          y: 0,
          rotateZ: 0,
          duration: 0.65,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (title) {
        gsap.to(title, {
          color: "rgba(255,255,255,0.9)",
          x: 0,
          duration: 0.45,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      if (floor) {
        gsap.to(floor, {
          opacity: 0.4,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          overwrite: "auto",
        });
      }
      blocks.forEach(resetBlock);
    };

    const onCardMove = (event: MouseEvent) => {
      if (!scene) return;
      const rect = card.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5;
      const ny = (event.clientY - rect.top) / rect.height - 0.5;

      gsap.to(scene, {
        x: nx * 14,
        y: ny * 10,
        rotateZ: nx * 3,
        duration: 0.75,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    const blockHandlers = Array.from(blocks).map((block) => {
      const platform = block.querySelector<HTMLElement>(".iso-platform");
      const icon = block.querySelector<HTMLElement>(".iso-icon");
      const glow = block.querySelector<SVGElement>(".iso-glow");
      const label = block.querySelector<HTMLElement>(".iso-label");
      const faces = block.querySelectorAll<SVGElement>(
        ".iso-face-top, .iso-face-left, .iso-face-right",
      );
      const arrow =
        block.nextElementSibling?.classList.contains("iso-arrow")
          ? block.nextElementSibling
          : null;

      const onBlockEnter = () => {
        if (platform) {
          gsap.to(platform, {
            y: -8,
            scale: 1.08,
            duration: 0.38,
            ease: "back.out(2.2)",
            overwrite: "auto",
          });
        }
        if (icon) {
          gsap.to(icon, {
            y: -3,
            scale: 1.22,
            rotate: -5,
            duration: 0.38,
            ease: "back.out(2.4)",
            overwrite: "auto",
          });
        }
        if (glow) {
          gsap.to(glow, {
            opacity: 0.85,
            scale: 1.3,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        }
        if (label) {
          gsap.to(label, {
            y: -3,
            color: "rgba(255,255,255,1)",
            duration: 0.32,
            overwrite: "auto",
          });
        }
        gsap.to(faces, {
          stroke: "rgba(96,165,250,0.45)",
          duration: 0.32,
          overwrite: "auto",
        });
        if (arrow) {
          gsap.to(arrow.querySelector(".iso-arrow-line"), {
            stroke: "rgba(96,165,250,0.55)",
            duration: 0.3,
            overwrite: "auto",
          });
          gsap.to(arrow.querySelector(".iso-flow-dot"), {
            attr: { r: 3.5 },
            duration: 0.3,
            overwrite: "auto",
          });
        }
      };

      const onBlockLeave = () => resetBlock(block);

      const onBlockDown = () => {
        if (platform) {
          gsap.to(platform, {
            scale: 0.94,
            y: -2,
            duration: 0.12,
            ease: "power2.in",
            overwrite: "auto",
          });
        }
      };

      const onBlockUp = () => {
        if (platform) {
          gsap.to(platform, {
            scale: 1.08,
            y: -8,
            duration: 0.28,
            ease: "back.out(2)",
            overwrite: "auto",
          });
        }
      };

      const onBlockFocus = () => onBlockEnter();
      const onBlockBlur = () => onBlockLeave();

      block.addEventListener("mouseenter", onBlockEnter);
      block.addEventListener("mouseleave", onBlockLeave);
      block.addEventListener("mousedown", onBlockDown);
      block.addEventListener("mouseup", onBlockUp);
      block.addEventListener("focus", onBlockFocus);
      block.addEventListener("blur", onBlockBlur);

      return () => {
        block.removeEventListener("mouseenter", onBlockEnter);
        block.removeEventListener("mouseleave", onBlockLeave);
        block.removeEventListener("mousedown", onBlockDown);
        block.removeEventListener("mouseup", onBlockUp);
        block.removeEventListener("focus", onBlockFocus);
        block.removeEventListener("blur", onBlockBlur);
      };
    });

    card.addEventListener("mouseenter", onCardEnter);
    card.addEventListener("mouseleave", onCardLeave);
    card.addEventListener("mousemove", onCardMove);

    return () => {
      card.removeEventListener("mouseenter", onCardEnter);
      card.removeEventListener("mouseleave", onCardLeave);
      card.removeEventListener("mousemove", onCardMove);
      blockHandlers.forEach((cleanup) => cleanup());
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className="workflow-card group/card flex min-h-[420px] flex-col rounded-3xl border border-white/[0.06] bg-[#12151c] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-[border-color,box-shadow] duration-500 hover:border-white/12 hover:shadow-[0_28px_90px_rgba(96,165,250,0.12)] sm:min-h-[460px] sm:p-7"
    >
      <p className="workflow-title mb-8 max-w-[16rem] text-sm leading-relaxed text-white/90 will-change-transform sm:text-[15px]">
        {workflow.title}
      </p>

      <div className="iso-scene relative mx-auto mt-auto flex w-full max-w-[220px] flex-col items-center pb-2">
        <svg
          viewBox="0 0 200 80"
          className="iso-floor pointer-events-none absolute bottom-6 left-1/2 h-20 w-[200px] -translate-x-1/2 opacity-40 will-change-transform"
          aria-hidden
        >
          <polygon
            points="100,10 180,50 100,70 20,50"
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <line
            x1="100"
            y1="10"
            x2="100"
            y2="70"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
          <line
            x1="20"
            y1="50"
            x2="180"
            y2="50"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        </svg>

        {workflow.steps.map((step, stepIndex) => (
          <div key={step.label} className="relative z-10 flex flex-col items-center">
            <IsometricBlock
              icon={step.icon}
              label={step.label}
              accent={step.accent}
              blockRef={(el) => {
                blockRefs.current[stepIndex] = el;
              }}
            />
            {stepIndex < workflow.steps.length - 1 && (
              <FlowArrow
                arrowRef={(el) => {
                  arrowRefs.current[stepIndex] = el;
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IsometricShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const kicker = kickerRef.current;
    if (!section || !heading) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set(heading, { opacity: 1, y: 0 });
      return;
    }

    let cleanupKicker: (() => void) | undefined;

    const ctx = gsap.context(() => {
      gsap.set(heading, { opacity: 0, y: 28 });
      if (kicker) gsap.set(kicker, { opacity: 0, x: -12 });

      gsap.to(heading, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      if (kicker) {
        gsap.to(kicker, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            toggleActions: "play none none reverse",
          },
        });

        const onKickerEnter = () => {
          gsap.to(kicker, {
            letterSpacing: "0.28em",
            color: "rgba(96,165,250,1)",
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const onKickerLeave = () => {
          gsap.to(kicker, {
            letterSpacing: "0.22em",
            color: "rgba(96,165,250,0.8)",
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        kicker.addEventListener("mouseenter", onKickerEnter);
        kicker.addEventListener("mouseleave", onKickerLeave);

        cleanupKicker = () => {
          kicker.removeEventListener("mouseenter", onKickerEnter);
          kicker.removeEventListener("mouseleave", onKickerLeave);
        };
      }
    }, section);

    return () => {
      cleanupKicker?.();
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="workflows"
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-[#05070a] py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.04)_0%,transparent_55%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <div className="mb-14 max-w-2xl">
          <p
            ref={kickerRef}
            className="mb-3 w-fit cursor-default text-xs font-semibold uppercase tracking-[0.22em] text-blue-400/80 will-change-[letter-spacing,color]"
          >
            How it works
          </p>
          <h2
            ref={headingRef}
            className="font-[family-name:var(--font-heading)] text-3xl font-medium tracking-tight text-white md:text-5xl"
          >
            AI workflows that move your business forward
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {WORKFLOWS.map((workflow, index) => (
            <WorkflowCard key={workflow.title} workflow={workflow} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
