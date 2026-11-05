"use client";

import { Check } from "lucide-react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { AnimatedList } from "@/components/ui/animated-list";
import { BorderBeam } from "@/components/ui/border-beam";
import { howItWorks } from "@/content/site";
import { cn } from "@/lib/utils";

type Step = (typeof howItWorks.steps)[number];
type Task = Step["diy"][number];

/** ms between tasks dropping in. */
const DROP = 700;
/** ms for the last task's spring to settle, then the pause before crossing off. */
const LAND = 400;
const HOLD = 500;
/** Crossing off: ms between rows, and how long each strike takes to draw. */
const STAGGER = 120;
const STRIKE = 350;

const EASE = [0.22, 1, 0.36, 1] as const;

const ROW = "flex items-center justify-between gap-3 rounded-lg border border-diy-row-line bg-white px-4 py-3 text-[15px] leading-snug text-ink";
/** "Blend does this.": deep green card in a deep bezel (outer frame + inner card classes). */
const DONE_FRAME = "bezel bezel-deep [--bezel-bg:var(--deep)] [--bezel-r:0.5rem]";
const DONE =
  "bezel-card relative flex w-full items-center gap-2.5 px-4 py-4 text-[17px] font-bold leading-snug text-on-deep";

/** Stable pseudo-random in [0, 1), so each row keeps its tilt across renders. */
function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Strike drawn through inline text as a growing background, so it follows wrapped lines left to right. */
const STRIKE_BG =
  "bg-[linear-gradient(currentColor,currentColor)] bg-no-repeat bg-position-[0_60%] [box-decoration-break:slice]";

function RowBody({ task, crossed, delay = 0 }: { task: Task; crossed?: boolean; delay?: number }) {
  const strike = (d: number) => ({
    initial: false as const,
    animate: { backgroundSize: crossed ? "100% 1.5px" : "0% 1.5px" },
    transition: { duration: STRIKE / 1000, ease: EASE, delay: d },
  });

  return (
    <>
      <span className="min-w-0">
        <motion.span {...strike(delay)} className={STRIKE_BG} style={{ backgroundSize: "0% 1.5px" }}>
          {task.task}
        </motion.span>
      </span>
      <motion.span
        {...strike(delay + (STRIKE * 0.6) / 1000)}
        className={cn(STRIKE_BG, "shrink-0 text-[13px] text-diy-tag")}
        style={{ backgroundSize: "0% 1.5px" }}
      >
        {task.when}
      </motion.span>
    </>
  );
}

function DoneBody() {
  return (
    <>
      <Check aria-hidden="true" strokeWidth={3} className="size-5 shrink-0 text-mint" />
      {howItWorks.diyDone}
    </>
  );
}

/**
 * One task: lands slightly tilted and nudged sideways. When crossed off, a strike is
 * drawn through the text and then the tag, left to right, while the row straightens and
 * fades to 35%.
 */
function TaskRow({ task, seed, crossed, delay }: { task: Task; seed: number; crossed: boolean; delay: number }) {
  const tilt = rand(seed) * 3 - 1.5; // -1.5° to 1.5°
  const shift = rand(seed + 101) * 12 - 6; // -6px to 6px
  const t = { duration: STRIKE / 1000, ease: EASE, delay };

  return (
    <motion.div
      initial={false}
      animate={crossed ? { rotate: 0, x: 0, opacity: 0.35 } : { rotate: tilt, x: shift, opacity: 1 }}
      transition={t}
      className={cn(ROW, "shadow-[0_1px_2px_rgb(11_20_16/0.05),0_4px_10px_-6px_rgb(11_20_16/0.12)]")}
    >
      <RowBody task={task} crossed={crossed} delay={delay} />
    </motion.div>
  );
}

/**
 * "Doing it yourself": once the card is in view, the manual work behind a step drops in
 * one row at a time (Magic UI Animated List, newest on top), with the full task count in
 * the header. ~500ms after the last one lands, each row is crossed off top to bottom,
 * then "Blend does this." lands at the bottom, closing the card. The crossed-off rows
 * stay, faded. Runs once.
 *
 * An invisible copy of the final layout sits in the same grid cell as the animation, so
 * the card is exactly as tall as its finished content from the start and nothing below
 * moves. The animation is hidden from screen readers, which get the list as text.
 */
function DiyFeed({ tasks, seed }: { tasks: readonly Task[]; seed: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const on = useInView(ref, { once: true, amount: 0.5 });
  const [landed, setLanded] = useState(0);
  const [phase, setPhase] = useState<"drop" | "cross" | "done">("drop");

  useEffect(() => {
    if (landed < tasks.length) return;
    const cross = setTimeout(() => setPhase("cross"), LAND + HOLD);
    const done = setTimeout(
      () => setPhase("done"),
      LAND + HOLD + (tasks.length - 1) * STAGGER + STRIKE + 150,
    );
    return () => {
      clearTimeout(cross);
      clearTimeout(done);
    };
  }, [landed, tasks.length]);

  return (
    <div className="bezel [--bezel-bg:var(--diy-card)] [--bezel-r:1rem]">
      <div ref={ref} className="bezel-card p-5 sm:p-7">
        <div className="flex items-baseline justify-between gap-4 text-sm font-semibold text-ink/60">
          <p>{howItWorks.diyLabel}</p>
          <p aria-hidden="true" className="tabular-nums">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
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

        <div aria-hidden="true" className="mt-4 grid">
          {/* Sizer: the finished layout, invisible. */}
          <div className="invisible col-start-1 row-start-1 flex flex-col gap-2.5">
            {tasks.map((t) => (
              <div key={t.task} className={ROW}>
                <RowBody task={t} />
              </div>
            ))}
            <div className={DONE_FRAME}>
              <div className={DONE}>
                <DoneBody />
              </div>
            </div>
          </div>

          <div className="col-start-1 row-start-1 flex flex-col gap-2.5 self-start">
            {on && (
              <AnimatedList delay={DROP} onItem={setLanded} enter="drop" className="gap-2.5">
                {tasks.map((t, i) => (
                  <TaskRow
                    key={t.task}
                    task={t}
                    seed={seed + i}
                    crossed={phase !== "drop"}
                    // Top to bottom: the newest task is on top.
                    delay={((tasks.length - 1 - i) * STAGGER) / 1000}
                  />
                ))}
              </AnimatedList>
            )}
            <AnimatePresence>
              {phase === "done" && (
                <motion.div
                  key="blend"
                  initial={{ opacity: 0, y: 12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", stiffness: 340, damping: 28 }}
                  className={DONE_FRAME}
                >
                  <div className={DONE}>
                    <DoneBody />
                    {/* One lap of the beam once it lands, then it fades away. */}
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ delay: 2.85, duration: 0.3 }}
                      className="pointer-events-none absolute -inset-px rounded-[inherit]"
                    >
                      <BorderBeam
                        size={80}
                        duration={3}
                        borderWidth={1.5}
                        colorFrom="var(--mint)"
                        colorTo="var(--brand)"
                        transition={{ repeat: 0 }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
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
