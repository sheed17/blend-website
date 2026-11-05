"use client"

import React, { useCallback, useEffect } from "react"
import { motion, useMotionTemplate, useMotionValue } from "motion/react"

import { cn } from "@/lib/utils"

/**
 * Magic Card, adapted from Magic UI (magicui.design/r/magic-card), spotlight mode only.
 *
 * Blend changes:
 * - `background` / `borderColor`: the card's fill and resting border (any CSS color /
 *   var). Upstream hard-codes the page background and border, which would hide dark or
 *   tinted cards.
 * - Mouse only: touch and pen pointers are ignored, so on touch devices it's a plain card.
 * - Orb mode and its next-themes dependency removed (unused here).
 */
interface MagicCardProps {
  children?: React.ReactNode
  className?: string
  /** Card fill. */
  background?: string
  /** Border color away from the cursor. */
  borderColor?: string
  /** Spotlight radius in px. */
  gradientSize?: number
  /** Spotlight color inside the card. */
  gradientColor?: string
  gradientOpacity?: number
  /** Border glow: inner and outer color of the ring that follows the cursor. */
  gradientFrom?: string
  gradientTo?: string
}

export function MagicCard({
  children,
  className,
  background = "var(--color-background)",
  borderColor = "var(--color-border)",
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity = 0.8,
  gradientFrom = "#9E7AFF",
  gradientTo = "#FE8BBB",
}: MagicCardProps) {
  const mouseX = useMotionValue(-gradientSize)
  const mouseY = useMotionValue(-gradientSize)

  const reset = useCallback(() => {
    mouseX.set(-gradientSize)
    mouseY.set(-gradientSize)
  }, [mouseX, mouseY, gradientSize])

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== "mouse") return
      const rect = e.currentTarget.getBoundingClientRect()
      mouseX.set(e.clientX - rect.left)
      mouseY.set(e.clientY - rect.top)
    },
    [mouseX, mouseY]
  )

  useEffect(() => {
    reset()
  }, [reset])

  useEffect(() => {
    const handleGlobalPointerOut = (e: PointerEvent) => {
      if (!e.relatedTarget) reset()
    }
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") reset()
    }
    window.addEventListener("pointerout", handleGlobalPointerOut)
    window.addEventListener("blur", reset)
    document.addEventListener("visibilitychange", handleVisibility)
    return () => {
      window.removeEventListener("pointerout", handleGlobalPointerOut)
      window.removeEventListener("blur", reset)
      document.removeEventListener("visibilitychange", handleVisibility)
    }
  }, [reset])

  const border = useMotionTemplate`
    linear-gradient(${background} 0 0) padding-box,
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${gradientFrom},
      ${gradientTo},
      ${borderColor} 100%
    ) border-box
  `
  const spotlight = useMotionTemplate`
    radial-gradient(${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${gradientColor},
      transparent 100%
    )
  `

  return (
    <motion.div
      className={cn(
        "group relative isolate overflow-hidden rounded-[inherit] border border-transparent",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={reset}
      style={{ background: border }}
    >
      <div className="absolute inset-px z-20 rounded-[inherit]" style={{ background }} />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-px z-30 rounded-[inherit]"
        style={{ background: spotlight, opacity: gradientOpacity }}
      />
      <div className="relative z-40 h-full">{children}</div>
    </motion.div>
  )
}
