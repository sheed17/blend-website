"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Animations run for every visitor: prefers-reduced-motion is deliberately ignored. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="never">{children}</MotionConfig>;
}
