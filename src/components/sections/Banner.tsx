"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Container } from "@/components/primitives/Container";
import { banner } from "@/content/site";

/**
 * Recurring full-bleed band (theme --banner), with faint drifting light
 * (held still below md).
 * Reusable on future pages. Pass `visual` to replace the drifting light.
 */
export function Banner({
  lines = banner.lines,
  visual,
}: {
  lines?: readonly string[];
  visual?: ReactNode;
}) {
  const drift = (x: string[], y: string[], duration: number) => ({
    animate: { x, y },
    transition: { duration, ease: "easeInOut" as const, repeat: Infinity },
  });

  return (
    <section
      aria-label={lines.join(" ")}
      className="relative overflow-hidden border-y border-banner-line bg-banner py-32 text-banner-ink md:py-48"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {visual ?? (
          <>
            <motion.div
              className="max-md:transform-none! absolute -left-[10%] -top-1/2 aspect-square w-[70vw] rounded-full bg-(image:--banner-glow)"
              {...drift(["0%", "18%", "0%"], ["0%", "12%", "0%"], 18)}
            />
            <motion.div
              className="max-md:transform-none! absolute -bottom-2/3 -right-[10%] aspect-square w-[80vw] rounded-full bg-(image:--banner-glow-2)"
              {...drift(["0%", "-15%", "0%"], ["0%", "-10%", "0%"], 22)}
            />
          </>
        )}
      </div>
      <Container className="relative">
        <p className="mx-auto text-balance text-center text-[clamp(2.5rem,6vw,6.25rem)] font-semibold leading-[0.95] tracking-headline">
          {lines.map((line, i) => (
            <span key={line} className={i === 1 ? "block text-banner-accent" : "block"}>
              {line}
            </span>
          ))}
        </p>
      </Container>
    </section>
  );
}
