"use client"

import { useRef, type ElementType, type ReactNode } from "react"

import { useAutoplayVideo } from "@/components/media/useAutoplayVideo"
import { cn } from "@/lib/utils"

/**
 * Video Text, adapted from Magic UI (magicui.design/r/video-text).
 *
 * Magic UI masks the video with an SVG data-URL <text>. An SVG used as an image
 * can't load the page's web fonts and doesn't wrap, so here the text stays real
 * DOM text (site font, normal wrapping) and the video shows through it with a
 * knockout: black text on white, `screen`-blended over the video, inside a group
 * that is `multiply`-blended onto the page, so the white drops out and only the
 * glyphs keep the video.
 *
 * The knockout is on at every width. The video only gets its src near the viewport
 * and plays while in view. If autoplay is blocked (e.g. iPhone Low Power Mode),
 * `fallback` (an animated WebP) fills the text instead; it is only requested then.
 */
export interface VideoTextProps {
  src: string
  /** Animated image used as the fill when the video can't autoplay. */
  fallback?: string
  children: ReactNode
  className?: string
  /** Classes for the video / fallback image (e.g. a filter to keep the fill readable). */
  videoClassName?: string
  /** Classes for a layer over the video / fallback (e.g. a brand-colour tint). Omit for none. */
  tintClassName?: string
  as?: ElementType
}

export function VideoText({
  src,
  fallback,
  children,
  className,
  videoClassName,
  tintClassName,
  as: Component = "div",
}: VideoTextProps) {
  const ref = useRef<HTMLElement>(null)
  const { videoRef, near, failed, onPlaying } = useAutoplayVideo(ref)
  const useFallback = failed && !!fallback
  const media = cn("pointer-events-none absolute inset-0 size-full object-cover", videoClassName)

  return (
    <Component ref={ref} className={cn("relative mix-blend-multiply", className)}>
      {near && !useFallback && (
        <video
          ref={videoRef}
          aria-hidden="true"
          src={src}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          onPlaying={onPlaying}
          className={media}
        />
      )}
      {useFallback && (
        // eslint-disable-next-line @next/next/no-img-element -- animated WebP, served as-is
        <img aria-hidden="true" alt="" src={fallback} decoding="async" className={media} />
      )}
      {tintClassName && (
        <span aria-hidden="true" className={cn("pointer-events-none absolute inset-0", tintClassName)} />
      )}
      {/* The shadow covers sub-pixel seams at the box edge, so no sliver of video shows there. */}
      <span className="relative block bg-(--knockout-light) py-[0.06em] text-(--knockout-dark) shadow-[0_0_0_2px_var(--knockout-light)] mix-blend-screen">
        {children}
      </span>
    </Component>
  )
}
