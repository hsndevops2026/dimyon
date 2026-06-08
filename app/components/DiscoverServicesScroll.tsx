"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SCROLL_DISTANCE = 4000;

const SERVICE_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    alt: "AI automation",
    from: { xPercent: -120, yPercent: 0, rotation: -14 },
    stack: { x: -36, y: -32, rotation: -10 },
  },
  {
    src: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
    alt: "Team collaboration",
    from: { xPercent: 120, yPercent: -20, rotation: 12 },
    stack: { x: 28, y: -18, rotation: 8 },
  },
  {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop",
    alt: "Data analytics",
    from: { xPercent: 0, yPercent: -130, rotation: -6 },
    stack: { x: -12, y: 22, rotation: -4 },
  },
  {
    src: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
    alt: "Intelligent systems",
    from: { xPercent: 80, yPercent: 120, rotation: 10 },
    stack: { x: 24, y: 28, rotation: 6 },
  },
  {
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop",
    alt: "Digital workflows",
    from: { xPercent: -90, yPercent: 110, rotation: -8 },
    stack: { x: 0, y: 0, rotation: -2 },
  },
] as const;

const SERVICE_LABELS = [
  "AI",
  "OCR",
  "Automation",
  "Visualizer",
  "Whatsapp",
] as const;

const STACK_PHASE_END = 0.38;
const STACK_EXIT_START = 0.44;
const STACK_EXIT_DURATION = 0.12;
const LABELS_START = 0.6;
const LABEL_SEGMENT = 0.075;

export default function DiscoverServicesScroll() {
  const triggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const stackWrapRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const trigger = triggerRef.current;
    const pin = pinRef.current;
    const title = titleRef.current;
    const stackWrap = stackWrapRef.current;
    const stack = stackRef.current;
    const list = listRef.current;
    const images = imageRefs.current.filter(Boolean) as HTMLDivElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLSpanElement[];

    if (
      !trigger ||
      !pin ||
      !title ||
      !stackWrap ||
      !stack ||
      !list ||
      images.length === 0 ||
      labels.length === 0
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set(title, { opacity: 0 });
      gsap.set(stack, { opacity: 0 });
      gsap.set(labels, { opacity: 1, y: 0 });
      gsap.set(list, { opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(title, {
        zIndex: 1,
        scale: 1,
        opacity: 1,
        transformOrigin: "center center",
        force3D: true,
      });

      gsap.set(stackWrap, { y: 0, opacity: 1 });
      gsap.set(list, { opacity: 1 });

      images.forEach((el, index) => {
        const config = SERVICE_IMAGES[index];
        gsap.set(el, {
          xPercent: config.from.xPercent,
          yPercent: config.from.yPercent,
          x: 0,
          y: 0,
          rotation: config.from.rotation,
          opacity: 0,
          zIndex: index + 1,
        });
      });

      labels.forEach((el) => {
        gsap.set(el, { y: 80, opacity: 0 });
      });

      const imageSegment = STACK_PHASE_END / images.length;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          pin,
          start: "top top",
          end: `+=${SCROLL_DISTANCE}`,
          scrub: 1,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        title,
        {
          scale: 0.32,
          opacity: 0.2,
          ease: "none",
          duration: STACK_PHASE_END,
        },
        0,
      );

      images.forEach((el, index) => {
        const config = SERVICE_IMAGES[index];

        tl.to(
          el,
          {
            xPercent: 0,
            yPercent: 0,
            x: config.stack.x,
            y: config.stack.y,
            rotation: config.stack.rotation,
            opacity: 1,
            ease: "none",
            duration: imageSegment,
          },
          0.04 + index * imageSegment,
        );
      });

      tl.to(
        stackWrap,
        {
          y: () => -window.innerHeight * 0.55,
          opacity: 0,
          ease: "none",
          duration: STACK_EXIT_DURATION,
        },
        STACK_EXIT_START,
      );

      labels.forEach((el, index) => {
        tl.to(
          el,
          {
            y: 0,
            opacity: 1,
            ease: "none",
            duration: LABEL_SEGMENT,
          },
          LABELS_START + index * LABEL_SEGMENT,
        );
      });
    }, trigger);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    return () => {
      window.removeEventListener("load", refresh);
      ctx.revert();
    };
  }, []);

  return (
    <section id="services" className="relative isolate bg-[#05070a]">
      <div ref={triggerRef} className="relative">
        <div
          ref={pinRef}
          className="relative z-40 flex h-svh w-full items-center justify-center overflow-hidden bg-[#05070a]"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_55%)]"
          />

          <div
            ref={stackWrapRef}
            className="pointer-events-none absolute inset-0 z-10"
          >
            <div className="absolute inset-0 z-[1] flex items-center justify-center">
              <h2
                ref={titleRef}
                className="pointer-events-none max-w-4xl px-6 text-center font-[family-name:var(--font-heading)] text-4xl font-medium tracking-tight text-white will-change-transform md:text-6xl lg:text-7xl"
              >
                Discover our services
              </h2>
            </div>

            <div className="absolute inset-0 z-[2] flex items-center justify-center">
              <div
                ref={stackRef}
                className="relative isolate h-52 w-40 md:h-64 md:w-52 lg:h-80 lg:w-60"
              >
                {SERVICE_IMAGES.map((image, index) => (
                  <div
                    key={image.alt}
                    ref={(el) => {
                      imageRefs.current[index] = el;
                    }}
                    className="absolute inset-0 m-auto h-44 w-32 overflow-hidden rounded-2xl border border-white/15 bg-[#05070a] shadow-2xl shadow-black/60 md:h-60 md:w-44 lg:h-72 lg:w-52"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      draggable={false}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div
            ref={listRef}
            className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 md:gap-3"
          >
            {SERVICE_LABELS.map((label, index) => (
              <span
                key={label}
                ref={(el) => {
                  labelRefs.current[index] = el;
                }}
                className="font-[family-name:var(--font-heading)] text-xl font-medium tracking-wide text-white/90 md:text-3xl lg:text-4xl"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
