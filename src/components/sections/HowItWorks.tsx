"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { AnimatedList } from "@/components/ui/animated-list";
import { howItWorks } from "@/content/site";
import { cn } from "@/lib/utils";

type Step = (typeof howItWorks.steps)[number];
type Task = Step["diy"][number];

/** ms between tasks dropping in. */
const DROP = 700;
/** ms for the last task's spring to settle, then the pause before the pile collapses. */
const LAND = 400;
const HOLD = 600;
/** ms for the pile to slide together before it shrinks away. */
const SLIDE = 600;

const EASE = [0.22, 1, 0.36, 1] as const;

/** Stable pseudo-random in [0, 1), so each note keeps its tilt across renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** One sticky note: tilted and nudged sideways while piled, squared up when the pile slides together. */
function TaskRow({ task, seed, together }: { task: Task; seed: number; together: boolean }) {
  const tilt = rand(seed) * 4 - 2; // -2° to 2°
  const shift = rand(seed + 101) * 16 - 8; // -8px to 8px

  return (
    <motion.div
      initial={false}
      animate={{ rotate: together ? 0 : tilt, x: together ? 0 : shift }}
      transition={{ duration: SLIDE / 1000, ease: EASE }}
      className="flex items-center justify-between gap-3 rounded-lg bg-note px-4 py-3 text-sm leading-snug text-ink shadow-[0_6px_14px_-6px_rgb(0_0_0/0.45),0_1px_2px_rgb(0_0_0/0.2)] sm:text-[15px]"
    >
      <span className="min-w-0">{task.task}</span>
      <span className="shrink-0 rounded-full bg-tag-tint px-2 py-0.5 font-mono text-[11px] font-medium text-tag">
        {task.when}
      </span>
    </motion.div>
  );
}

/**
 * "Doing it yourself": once the card is in view, the manual work behind a step drops in
 * one note at a time (Magic UI Animated List, newest on top) into a messy pile, with a
 * counter in the header. ~600ms after the last one lands the pile slides together,
 * shrinks and fades, and one solid "✓ Blend does this." row takes its place and stays.
 * Runs once, no loop.
 *
 * The pile area is a fixed height so nothing below moves. Desktop fits every note;
 * phones show about five, with older ones fading out at the bottom. The animation is
 * hidden from screen readers, which get the task list as plain text instead.
 */
function DiyFeed({ tasks, seed }: { tasks: readonly Task[]; seed: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.5 });
  const [landed, setLanded] = useState(0);
  const [phase, setPhase] = useState<"pile" | "together" | "done">("pile");

  useEffect(() => {
    if (landed < tasks.length) return;
    const together = setTimeout(() => setPhase("together"), LAND + HOLD);
    const done = setTimeout(() => setPhase("done"), LAND + HOLD + SLIDE);
    return () => {
      clearTimeout(together);
      clearTimeout(done);
    };
  }, [landed, tasks.length]);

  return (
    <div
      ref={ref}
      className="rounded-2xl bg-deep p-6 shadow-[0_24px_60px_-36px_color-mix(in_srgb,var(--ink)_60%,transparent)] sm:p-8"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="text-sm font-medium text-mint">{howItWorks.diyLabel}</p>
        <p aria-hidden="true" className="font-mono text-xs tabular-nums text-mint/70">
          {landed} {landed === 1 ? "task" : "tasks"}
        </p>
      </div>

      <ul className="sr-only">
        {tasks.map((t) => (
          <li key={t.task}>
            {t.task} ({t.when})
          </li>
        ))}
        <li>{howItWorks.diyDone}</li>
      </ul>

      {/* sm+: tall enough for every note (~2.8rem each, 0.625rem gaps, plus room for the tilt). */}
      <div
        aria-hidden="true"
        style={{ "--rows": tasks.length } as CSSProperties}
        className={cn(
          "-mx-3 mt-5 flex h-[21rem] flex-col overflow-hidden px-3 py-2 sm:h-[calc(var(--rows)*2.8rem+(var(--rows)-1)*0.625rem+1rem)]",
          phase === "pile" && "[mask-image:linear-gradient(to_bottom,#000_75%,transparent)] sm:[mask-image:none]",
        )}
      >
        <AnimatePresence mode="wait">
          {phase !== "done" ? (
            <motion.div
              key="pile"
              layout="position"
              transition={{ duration: SLIDE / 1000, ease: EASE }}
              exit={{ scale: 0.85, opacity: 0, transition: { duration: 0.35, ease: EASE } }}
              className={cn("w-full", phase === "together" && "my-auto")}
            >
              {on && (
                <AnimatedList
                  delay={DROP}
                  onItem={setLanded}
                  className={phase === "together" ? "grid [&>*]:col-start-1 [&>*]:row-start-1" : "gap-2.5"}
                >
                  {tasks.map((t, i) => (
                    <TaskRow key={t.task} task={t} seed={seed + i} together={phase === "together"} />
                  ))}
                </AnimatedList>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="blend"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="my-auto flex w-full items-center gap-2.5 rounded-xl bg-brand px-5 py-4 text-lg font-bold text-ink shadow-[0_14px_30px_-14px_rgb(0_0_0/0.5)]"
            >
              <span>✓</span>
              {howItWorks.diyDone}
            </motion.div>
          )}
        </AnimatePresence>
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
        <DiyFeed tasks={step.diy} seed={Number(step.number) * 10} />
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
