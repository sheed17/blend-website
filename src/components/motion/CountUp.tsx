"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";

/**
 * Counts a figure up from zero the first time it scrolls into view.
 * Only the digits animate; prefix and suffix stay put.
 * A suffix starting with a space ("60 days") gets one normal-width
 * non-breaking space, set in the sans font rather than a wide mono space.
 * Server HTML and screen readers always get the final value.
 */
export function CountUp({
  value,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const armed = useRef(false);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  // Below the fold on load: reset to zero so there is something to count up from.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = String(value);
      armed.current = false;
      return;
    }
    if (el.getBoundingClientRect().top > window.innerHeight) {
      el.textContent = "0";
      armed.current = true;
    }
  }, [reduce, value]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || !armed.current) return;
    armed.current = false;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = String(Math.round(v));
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  const spaced = suffix.startsWith(" ");
  const unit = spaced ? suffix.slice(1) : suffix;

  return (
    <span className={className}>
      <span className="sr-only">{`${prefix}${value}${suffix}`}</span>
      <span aria-hidden="true" className="whitespace-nowrap">
        {prefix}
        <span ref={ref}>{value}</span>
        {spaced ? <span className="font-sans">{" "}</span> : null}
        {unit}
      </span>
    </span>
  );
}
