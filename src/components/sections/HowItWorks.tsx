"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { howItWorks } from "@/content/site";

type Step = (typeof howItWorks.steps)[number];

/** Seconds between ticks, and before the first one. */
const TICK = 0.25;
const FIRST_TICK = 0.2;

/** Empty box that fills and draws a check after `delay` once `on` turns true. Decorative. */
function Checkbox({ on, delay }: { on: boolean; delay: number }) {
  return (
    <span aria-hidden="true" className="relative mt-[0.2em] size-[1.125rem] shrink-0 rounded-[5px] border-[1.5px] border-ink/25">
      <motion.span
        className="absolute -inset-[1.5px] rounded-[5px] bg-ink"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={on ? { opacity: 1, scale: 1 } : undefined}
        transition={{ delay, duration: 0.18, ease: "easeOut" }}
      />
      <svg viewBox="0 0 18 18" className="absolute -inset-[1.5px] size-[calc(100%+3px)]" fill="none">
        <motion.path
          d="M4.5 9.4 7.6 12.4 13.5 6"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={on ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ delay: delay + 0.08, duration: 0.2, ease: "easeOut" }}
        />
      </svg>
    </span>
  );
}

/** "Doing it yourself": the manual steps tick off one by one when the card scrolls into view. */
function DiyChecklist({ items }: { items: readonly string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.6 });

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-line bg-white p-6 shadow-[0_24px_60px_-40px_color-mix(in_srgb,var(--ink)_25%,transparent)] sm:p-8"
    >
      <p className="text-sm font-medium text-muted-foreground">{howItWorks.diyLabel}</p>
      <ul className="mt-5 space-y-3.5">
        {items.map((item, i) => (
          <li key={item} className="flex gap-3 text-base leading-snug text-ink">
            <Checkbox on={on} delay={FIRST_TICK + i * TICK} />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      <motion.p
        className="mt-6 border-t border-line pt-5 text-lg font-semibold text-brand-text"
        initial={{ opacity: 0, y: 6 }}
        animate={on ? { opacity: 1, y: 0 } : undefined}
        transition={{ delay: FIRST_TICK + items.length * TICK + 0.2, duration: 0.4, ease: "easeOut" }}
      >
        {howItWorks.diyDone}
      </motion.p>
    </div>
  );
}

function StepRow({ step }: { step: Step }) {
  return (
    <li className="grid gap-10 border-t border-line py-14 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-20">
      <Reveal className="min-w-0">
        <span className="font-mono text-sm font-medium text-brand-text">{step.number}</span>
        <h3 className="mt-5 text-[clamp(2.75rem,5.5vw,5rem)] font-semibold leading-none tracking-headline text-ink">
          {step.title}
        </h3>
        <p className="mt-6 max-w-[30ch] text-xl leading-snug tracking-[-0.01em] text-ink md:text-2xl">{step.body}</p>
      </Reveal>
      <div className="min-w-0 lg:max-w-[520px] lg:justify-self-end lg:w-full">
        <DiyChecklist items={step.diy} />
      </div>
    </li>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-it-works-title" className="scroll-mt-16 bg-background pb-28 pt-14 md:pb-40 md:pt-20">
      <Container>
        <SectionHeader id="how-it-works-title" headline={howItWorks.headline} />

        <ol className="mt-10 md:mt-14">
          {howItWorks.steps.map((step) => (
            <StepRow key={step.number} step={step} />
          ))}
        </ol>

        <Reveal className="border-t border-line pt-16 lg:pt-24">
          <p className="max-w-[24ch] text-balance text-[clamp(2rem,4.2vw,3.75rem)] font-semibold leading-[1.05] tracking-headline text-ink">
            {howItWorks.closing}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
