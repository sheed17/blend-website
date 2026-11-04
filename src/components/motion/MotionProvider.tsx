"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/** Respect the user's prefers-reduced-motion setting for all animations. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
