"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { BackgroundVideo } from "@/components/media/BackgroundVideo";
import { expandVideo } from "@/content/site";

/**
 * Scroll-expanding video (after 21st.dev's scroll-expansion-hero, built as an inline
 * section). The stage pins for the section's length; the card starts as a rounded card
 * (85% wide on mobile, 60% from md) and grows to full bleed with square corners. Once
 * it's open, a light overlay and one line fade in.
 *
 * Cheap per frame: only the --p custom property changes; scale and radius are derived
 * in CSS (.expand-card in globals.css), so it's a transform, not a layout change.
 * Reduced motion: no pinning, a static full-width card (poster only) with the line shown.
 */
export function ScrollExpandVideo() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useTransform(scrollYProgress, [0, 0.7], [0, 1]);
  const reveal = useTransform(scrollYProgress, [0.62, 0.82], [0, 1]);

  return (
    <section
      ref={ref}
      aria-labelledby="expand-video-line"
      className="relative bg-background motion-safe:h-[160svh] motion-safe:md:h-[220svh]"
    >
      <div className="relative flex h-[70svh] items-center justify-center overflow-hidden motion-safe:sticky motion-safe:top-0 motion-safe:h-svh">
        <motion.div
          className="expand-card absolute inset-0 overflow-hidden bg-ink [--s0:0.85] md:[--s0:0.6]"
          style={reduce ? undefined : ({ "--p": p } as unknown as CSSProperties)}
        >
          <BackgroundVideo src="/media/strip.mp4" poster="/media/strip-poster.jpg" />
          <motion.div aria-hidden="true" className="absolute inset-0 bg-(--expand-overlay)" style={{ opacity: reduce ? 1 : reveal }} />
        </motion.div>
        <motion.p
          id="expand-video-line"
          style={{ opacity: reduce ? 1 : reveal }}
          className="relative mx-4 max-w-[18ch] text-balance text-center text-[clamp(2.25rem,5.5vw,5rem)] font-semibold leading-[1] tracking-headline text-white [text-shadow:0_2px_24px_color-mix(in_srgb,var(--ink)_35%,transparent)]"
        >
          {expandVideo.line}
        </motion.p>
      </div>
    </section>
  );
}
