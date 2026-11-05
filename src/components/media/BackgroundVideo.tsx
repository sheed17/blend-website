"use client";

import Image from "next/image";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { useAutoplayVideo } from "./useAutoplayVideo";

/**
 * Decorative, muted, looping background video that fills its (positioned, already-sized)
 * parent, so it never causes layout shift.
 *
 * - The poster is always underneath (object-cover), served as-is (no re-encoding).
 * - The <video> gets its src only once the box comes within 400px of the viewport,
 *   plays when in view, fades in when it actually starts, and pauses while off screen.
 * - If autoplay is blocked (play() rejects, or nothing plays within ~1.5s, e.g. iPhone
 *   Low Power Mode), the <video> is removed and `fallback` (an animated WebP) is shown in
 *   the same spot. The fallback is only requested in that case.
 * - `overlay` is a class for the tint layer drawn over the video (e.g. bg-(--belief-overlay)).
 */
export function BackgroundVideo({
  src,
  poster,
  fallback,
  overlay,
  className,
}: {
  src: string;
  poster: string;
  /** Animated image shown when the video can't autoplay. */
  fallback?: string;
  overlay?: string;
  className?: string;
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const { videoRef, near, playing, failed, onPlaying } = useAutoplayVideo(boxRef);
  const useFallback = failed && !!fallback;

  return (
    <div ref={boxRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <Image src={poster} alt="" fill sizes="100vw" unoptimized className="object-cover" />
      {near && !useFallback && (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onPlaying={onPlaying}
          className={cn(
            "absolute inset-0 size-full object-cover transition-opacity duration-700",
            playing ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      {useFallback && <Image src={fallback} alt="" fill sizes="100vw" unoptimized className="object-cover" />}
      {overlay && <div className={cn("absolute inset-0", overlay)} />}
    </div>
  );
}
