"use client";

import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { BeamDiagram, StepVisual } from "@/components/visuals/BeamDiagram";
import { howItWorks } from "@/content/site";
import { cn } from "@/lib/utils";

type Step = (typeof howItWorks.steps)[number];

function StepBlock({
  step,
  index,
  active,
  onActive,
}: {
  step: Step;
  index: number;
  active: boolean;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // "Active" when the step crosses the middle band of the viewport.
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li ref={ref} className="flex flex-col justify-center py-14 lg:min-h-[75svh] lg:py-0">
      <div className={cn("border-t pt-8 transition-colors duration-500", active ? "border-ink" : "border-line")}>
        <span className="font-mono text-sm font-medium text-brand-text">{step.number}</span>
        <h3
          className={cn(
            "mt-5 text-[clamp(2.75rem,5.5vw,5rem)] font-semibold leading-none tracking-headline transition-colors duration-500",
            // Inactive titles stay at 50% ink (≥3:1, passes for large text).
            active ? "text-ink" : "text-ink lg:text-ink/50",
          )}
        >
          {step.title}
        </h3>
        <p className="mt-6 max-w-[30ch] text-xl leading-snug tracking-[-0.01em] text-ink md:text-2xl">{step.body}</p>
        <p className="mt-6 max-w-[40ch] text-[15px] leading-relaxed text-body">
          <span className="font-medium text-ink">Before: </span>
          {step.before}
        </p>
      </div>

      {/* Mobile / tablet: a small static visual of just this step's part of the flow
          (the full animated diagram is desktop only). */}
      <div className="mt-10 rounded-3xl bg-surface p-3 sm:p-8 lg:hidden">
        <div className="overflow-hidden rounded-2xl border border-line bg-white">
          <StepVisual step={index as 0 | 1 | 2} className="min-h-[168px] px-5 py-10" />
        </div>
      </div>
    </li>
  );
}

/** Sticky scroll: steps scroll on the left, the matching visual stays pinned on the right. */
export function HowItWorks() {
  const [active, setActive] = useState<0 | 1 | 2>(0);
  const onActive = (i: number) => setActive(i as 0 | 1 | 2);

  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="scroll-mt-16 bg-background pb-28 pt-14 md:pb-40 md:pt-20">
      <Container>
        <SectionHeader id="how-it-works-title" headline={howItWorks.headline} />

        <div className="mt-10 grid gap-16 lg:mt-0 lg:grid-cols-2">
          <ol className="min-w-0">
            {howItWorks.steps.map((step, i) => (
              <StepBlock key={step.number} step={step} index={i} active={active === i} onActive={onActive} />
            ))}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-[12.5svh] flex h-[75svh] items-center">
              <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2rem] bg-surface p-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-1/3 left-1/2 aspect-square w-[120%] -translate-x-1/2 rounded-full bg-(image:--glow-steps)"
                />
                {/* One persistent diagram: its state follows the active step (no card swapping,
                    so beam paths stay aligned). */}
                <div className="relative w-full max-w-[460px] overflow-hidden rounded-2xl border border-line bg-white shadow-[0_30px_80px_-40px_color-mix(in_srgb,var(--ink)_28%,transparent)]">
                  <BeamDiagram step={active} className="min-h-[380px] px-8 py-10" />
                </div>
                <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2" aria-hidden="true">
                  {howItWorks.steps.map((s, i) => (
                    <span
                      key={s.number}
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500",
                        i === active ? "w-6 bg-accent-line" : "w-1.5 bg-ink/20",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
