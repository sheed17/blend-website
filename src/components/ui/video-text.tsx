"use client"

import { useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState, type ElementType } from "react"

import { cn } from "@/lib/utils"

/**
 * Video Text, adapted from Magic UI (magicui.design/r/video-text).
 *
 * Magic UI masks the video with an SVG data-URL <text>. An SVG used as an image
 * can't load the page's web fonts and doesn't wrap, so here the text stays real
 * DOM text (site font, normal wrapping) and the video shows through it with a
 * knockout: black text on white, `screen`-blended over the video, inside a group
 * that is `multiply`-blended onto the page, so the white drops out and only the
 * glyphs keep the video. Same box in every mode, so switching causes no layout shift.
 *
 * Plain text (className's color) is rendered on the server, below `minWidth`, and
 * with prefers-reduced-motion. The video only gets its src near the viewport.
 */
export interface VideoTextProps {
  src: string
  /** The text. A plain string, so the same text works in both modes. */
  children: string
  className?: string
  /** Classes for the video (e.g. a filter to keep the fill readable). */
  videoClassName?: string
  /** Narrowest viewport (px) that gets the video fill. */
  minWidth?: number
  as?: ElementType
}

export function VideoText({
  src,
  children,
  className,
  videoClassName,
  minWidth = 640,
  as: Component = "div",
}: VideoTextProps) {
  const reduce = useReducedMotion() ?? false
  const ref = useRef<HTMLElement>(null)
  const [wide, setWide] = useState(false)
  const [near, setNear] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`)
    const update = () => setWide(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [minWidth])

  const video = wide && !reduce

  useEffect(() => {
    const el = ref.current
    if (!el || !video) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "400px 0px" })
    io.observe(el)
    return () => io.disconnect()
  }, [video])

  return (
    <Component ref={ref} className={cn("relative", video && "mix-blend-multiply", className)}>
      {video && near && (
        <video
          aria-hidden="true"
          src={src}
          muted
          autoPlay
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          className={cn("pointer-events-none absolute inset-0 size-full object-cover", videoClassName)}
        />
      )}
      <span
        className={cn(
          "relative block py-[0.06em]",
          // The shadow covers sub-pixel seams at the box edge, so no sliver of video shows there.
          video && "bg-(--knockout-light) text-(--knockout-dark) shadow-[0_0_0_2px_var(--knockout-light)] mix-blend-screen",
        )}
      >
        {children}
      </span>
    </Component>
  )
}
