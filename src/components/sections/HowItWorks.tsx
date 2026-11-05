"use client";

import { useInView } from "framer-motion";
import { useRef, type CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { AnimatedList } from "@/components/ui/animated-list";
import { howItWorks } from "@/content/site";
import { cn } from "@/lib/utils";

type Step = (typeof howItWorks.steps)[number];
type Task = Step["diy"][number];

/** ms between items dropping in. */
const DROP = 700;

const ROW = "flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-sm leading-snug sm:text-[15px]";

function TaskRow({ task }: { task: Task }) {
  return (
    <div className={cn(ROW, "border-line bg-white text-ink shadow-[0_1px_2px_color-mix(in_srgb,var(--ink)_5%,transparent)]")}>
      <span className="min-w-0">{task.task}</span>
      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{task.when}</span>
    </div>
  );
}

/**
 * "Doing it yourself": the manual work behind a step drops in one task at a time
 * (Magic UI Animated List, newest on top) once the card is in view, then "Blend does
 * this." lands on top and stays. Runs once, no loop.
 *
 * The list area is a fixed height so nothing below moves while it fills. Desktop fits
 * every item; phones show about five, with older ones fading out at the bottom.
 */
function DiyFeed({ tasks }: { tasks: readonly Task[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.5 });

  return (
    <div ref={ref} className="rounded-2xl border border-line bg-white p-5 shadow-[0_24px_60px_-40px_color-mix(in_srgb,var(--ink)_25%,transparent)] sm:p-6">
      <p className="text-sm font-medium text-muted-foreground">{howItWorks.diyLabel}</p>
      {/* sm+: tall enough for this card's rows (tasks + the Blend row; rows ~2.95rem, 0.5rem gaps, single line). */}
      <div
        style={{ "--rows": tasks.length + 1 } as CSSProperties}
        className="mt-4 h-[17rem] overflow-hidden [mask-image:linear-gradient(to_bottom,#000_70%,transparent)] sm:h-[calc(var(--rows)*2.95rem+(var(--rows)-1)*0.5rem+0.25rem)] sm:[mask-image:none]"
      >
        {on && (
          <AnimatedList delay={DROP} className="gap-2">
            {tasks.map((t) => (
              <TaskRow key={t.task} task={t} />
            ))}
            <div key="blend" className={cn(ROW, "border-brand bg-brand font-semibold text-ink")}>
              {howItWorks.diyDone}
            </div>
          </AnimatedList>
        )}
      </div>
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
      <div className="min-w-0 lg:w-full lg:max-w-[520px] lg:justify-self-end">
        <DiyFeed tasks={step.diy} />
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
