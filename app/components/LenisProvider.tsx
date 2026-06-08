'use client';

import { useEffect } from 'react';
import type { LenisOptions } from 'lenis';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

/** Syncs Lenis smooth scroll with GSAP ScrollTrigger (official Lenis + GSAP pattern). */
function LenisGsapSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value as number, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        };
      },
      pinType: 'fixed',
    });

    const onRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener('refresh', onRefresh);

    const onScroll = () => ScrollTrigger.update();
    const unsubscribeScroll = lenis.on('scroll', onScroll);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    requestAnimationFrame(() => {
      lenis.resize();
      ScrollTrigger.refresh();
    });

    return () => {
      ScrollTrigger.removeEventListener('refresh', onRefresh);
      unsubscribeScroll();
      gsap.ticker.remove(onTick);
    };
  }, [lenis]);

  return null;
}

function getLenisOptions(): LenisOptions {
  if (typeof window === 'undefined') return { autoRaf: false };

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  return {
    autoRaf: false,
    lerp: reducedMotion ? 1 : 0.08,
    duration: reducedMotion ? 0 : 1.2,
    smoothWheel: !reducedMotion,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
    anchors: reducedMotion
      ? false
      : {
          offset: -80,
        },
  };
}

export default function LenisProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis root options={getLenisOptions()}>
      <LenisGsapSync />
      {children}
    </ReactLenis>
  );
}
