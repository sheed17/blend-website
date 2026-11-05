"use client"

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
} from "react"
import { AnimatePresence, motion, type MotionProps } from "motion/react"

import { cn } from "@/lib/utils"

/** How a new item arrives: grow from nothing (Magic UI default) or a short drop and fade. */
export type AnimatedListEnter = "scale" | "drop"

const ENTER: Record<AnimatedListEnter, MotionProps["initial"]> = {
  scale: { scale: 0, opacity: 0 },
  drop: { y: -10, scale: 0.98, opacity: 0 },
}

export function AnimatedListItem({
  children,
  enter = "scale",
}: {
  children: React.ReactNode
  enter?: AnimatedListEnter
}) {
  const animations: MotionProps = {
    initial: ENTER[enter],
    animate: { y: 0, scale: 1, opacity: 1, originY: 0 },
    // Fade only, so the oldest item (pushed to the bottom) fades out in place.
    exit: { opacity: 0, transition: { duration: 0.35 } },
    transition: { type: "spring", stiffness: 350, damping: 40 },
  }

  return (
    <motion.div {...animations} layout className="mx-auto w-full">
      {children}
    </motion.div>
  )
}

export interface AnimatedListProps extends ComponentPropsWithoutRef<"div"> {
  children: React.ReactNode
  /** ms between items dropping in. */
  delay?: number
  /** Start over from the first child after the last one, forever. */
  loop?: boolean
  /** Most items shown at once; older ones exit at the bottom. */
  max?: number
  /** Hold the current state (e.g. while off screen). */
  paused?: boolean
  /** Called with how many items have dropped in so far (1, 2, 3, ...). */
  onItem?: (dropped: number) => void
  /** Entrance for each new item (default "scale"). */
  enter?: AnimatedListEnter
}

/**
 * Magic UI Animated List, extended: newest item drops in on top. Without `loop` it
 * stops once every child is in; with `loop` it cycles the children with fresh keys
 * so each pass animates in again.
 */
export const AnimatedList = React.memo(
  ({
    children,
    className,
    delay = 1000,
    loop = false,
    max,
    paused = false,
    onItem,
    enter,
    ...props
  }: AnimatedListProps) => {
    const childrenArray = useMemo(
      () => React.Children.toArray(children) as React.ReactElement[],
      [children]
    )
    const n = childrenArray.length
    const [dropped, setDropped] = useState(1)
    const finished = !loop && dropped >= n

    useEffect(() => {
      if (paused || finished || n === 0) return
      const timeout = setTimeout(() => setDropped((d) => d + 1), delay)
      return () => clearTimeout(timeout)
    }, [dropped, paused, finished, delay, n])

    const onItemRef = useRef(onItem)
    useEffect(() => {
      onItemRef.current = onItem
    })
    useEffect(() => {
      onItemRef.current?.(Math.min(dropped, loop ? dropped : n))
    }, [dropped, loop, n])

    const itemsToShow = useMemo(() => {
      if (n === 0) return []
      const last = Math.min(dropped, loop ? dropped : n) - 1
      const first = Math.max(0, last - (max ?? Infinity) + 1)
      const out: { key: React.Key; item: React.ReactElement }[] = []
      for (let i = last; i >= first; i--) {
        const item = childrenArray[i % n]
        out.push({ key: loop ? `${item.key}-${i}` : (item.key ?? i), item })
      }
      return out
    }, [dropped, loop, max, n, childrenArray])

    return (
      <div
        className={cn(`flex flex-col items-center gap-4`, className)}
        {...props}
      >
        <AnimatePresence>
          {itemsToShow.map(({ key, item }) => (
            <AnimatedListItem key={key} enter={enter}>
              {item}
            </AnimatedListItem>
          ))}
        </AnimatePresence>
      </div>
    )
  }
)

AnimatedList.displayName = "AnimatedList"
