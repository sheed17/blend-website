"use client";

import { useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Decorative, muted, looping background video that fills its (positioned, already-sized)
 * parent, so it never causes layout shift.
 *
 * - The poster is always underneath (object-cover), served as-is (no re-encoding).
 * - The <video> gets its src only once the box comes within LOAD_MARGIN of the
 *   viewport, fades in when it actually starts playing, and pauses while off screen.
 * - With prefers-reduced-motion no <video> is rendered: the poster stays.
 * - `overlay` is a class for the tint layer drawn over the video (e.g. bg-(--belief-overlay)).
 */
const LOAD_MARGIN = "400px 0px";

export function BackgroundVideo({
  src,
  poster,
  overlay,
  className,
}: {
  src: string;
  poster: string;
  overlay?: string;
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const boxRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const box = boxRef.current;
    if (!box || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          videoRef.current?.play().catch(() => {});
        } else {
          videoRef.current?.pause();
        }
      },
      { rootMargin: LOAD_MARGIN },
    );
    io.observe(box);
    return () => io.disconnect();
  }, [reduce]);

  const showVideo = near && !reduce;

  return (
    <div ref={boxRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <Image src={poster} alt="" fill sizes="100vw" unoptimized className="object-cover" />
      {showVideo && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onPlaying={() => setPlaying(true)}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            playing ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      {overlay && <div className={cn("absolute inset-0", overlay)} />}
    </div>
  );
}
