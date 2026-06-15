"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

const VISUALIZER_VIDEOS = [
  {
    src: "/video/visualizer_video.mp4",
    title: "Visualizer demo 1",
  },
  {
    src: "/video/visualizer_video_2.mp4",
    title: "Visualizer demo 2",
  },
] as const;

const SLOT_OFFSETS = [-1, 0, 1] as const;

function getWrappedIndex(index: number) {
  return (
    ((index % VISUALIZER_VIDEOS.length) + VISUALIZER_VIDEOS.length) %
    VISUALIZER_VIDEOS.length
  );
}

export default function VisualizerVideo() {
  const [active, setActive] = useState(0);
  const [spread, setSpread] = useState(248);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const pauseAllVideos = useCallback(() => {
    videoRefs.current.forEach((video) => video?.pause());
  }, []);

  const goTo = useCallback(
    (index: number) => {
      pauseAllVideos();
      setActive(getWrappedIndex(index));
    },
    [pauseAllVideos],
  );

  const handlePrev = () => goTo(active - 1);
  const handleNext = () => goTo(active + 1);

  useEffect(() => {
    pauseAllVideos();
  }, [active, pauseAllVideos]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 639px)");
    const updateSpread = () => setSpread(mediaQuery.matches ? 168 : 248);

    updateSpread();
    mediaQuery.addEventListener("change", updateSpread);
    return () => mediaQuery.removeEventListener("change", updateSpread);
  }, []);

  return (
    <section
      id="visualizer"
      className="relative isolate overflow-hidden bg-[#05070a] py-24 sm:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(96,165,250,0.06)_0%,transparent_55%)]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-10">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-blue-400/80">
            Visualizer
          </p>
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-medium tracking-tight text-white md:text-5xl">
            Turn Imagination Into Reality
          </h2>
        </div>

        <div className="relative">
          <p className="absolute right-0 top-0 text-sm font-medium tracking-wide text-white/45">
            {String(active + 1).padStart(2, "0")}/
            {String(VISUALIZER_VIDEOS.length).padStart(2, "0")}
          </p>

          <div className="relative mx-auto flex min-h-[28rem] max-w-5xl items-center justify-center sm:min-h-[32rem]">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous video"
              className="absolute left-0 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-2 md:left-6"
            >
              <IconArrowLeft className="h-5 w-5 text-white/80" />
            </button>

            <div className="relative h-[26rem] w-full sm:h-[30rem]">
              {SLOT_OFFSETS.map((offset) => {
                const index = getWrappedIndex(active + offset);
                const video = VISUALIZER_VIDEOS[index];
                const isCenter = offset === 0;
                const frameClassName = `block w-full overflow-hidden rounded-3xl border bg-[#12151c] shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-[border-color,box-shadow] ${
                  isCenter
                    ? "border-white/10 shadow-[0_28px_90px_rgba(96,165,250,0.14)]"
                    : "cursor-pointer border-white/[0.06] hover:border-white/15"
                }`;

                const videoElement = (
                  <video
                    key={`${offset}-${video.src}`}
                    ref={(element) => {
                      videoRefs.current[index] = element;
                    }}
                    className="aspect-[9/16] w-full bg-black object-cover"
                    controls={isCenter}
                    muted={!isCenter}
                    playsInline
                    preload="metadata"
                    aria-label={video.title}
                  >
                    <source src={video.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                );

                return (
                  <motion.div
                    key={offset}
                    className="absolute left-1/2 top-1/2 w-[13.5rem] -translate-x-1/2 -translate-y-1/2 sm:w-[16rem] md:w-[18rem]"
                    animate={{
                      x: offset * spread,
                      scale: isCenter ? 1 : 0.76,
                      opacity: isCenter ? 1 : 0.45,
                      zIndex: isCenter ? 30 : 20 - Math.abs(offset),
                    }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {isCenter ? (
                      <div className={frameClassName}>{videoElement}</div>
                    ) : (
                      <button
                        type="button"
                        onClick={
                          offset === -1 ? handlePrev : handleNext
                        }
                        aria-label={
                          offset === -1
                            ? "View previous video"
                            : "View next video"
                        }
                        className={frameClassName}
                      >
                        {videoElement}
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next video"
              className="absolute right-0 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-2 md:right-6"
            >
              <IconArrowRight className="h-5 w-5 text-white/80" />
            </button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2">
            {VISUALIZER_VIDEOS.map((video, index) => (
              <button
                key={video.src}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to ${video.title}`}
                aria-current={index === active ? "true" : undefined}
                className={`h-0.5 rounded-full transition-all duration-300 ${
                  index === active
                    ? "w-8 bg-white"
                    : "w-4 bg-white/25 hover:bg-white/45"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
