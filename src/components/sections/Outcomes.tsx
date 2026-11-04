"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { outcomes } from "@/content/site";
import { cn } from "@/lib/utils";

/** Abstract rising bars on ink: money coming back, month over month. No axes, no numbers. */
function RisingBars() {
  const heights = [18, 26, 24, 34, 40, 38, 52, 60, 72, 86];
  return (
    <div aria-hidden="true" className="flex h-40 items-end gap-2 sm:h-52 md:gap-3 lg:h-72">
      {heights.map((h, i) => (
        <motion.div
          key={i}
          className={cn("flex-1 rounded-t-md", i >= heights.length - 3 ? "bg-mint" : "bg-white/15")}
          style={{ height: `${h}%`, originY: 1 }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
    </div>
  );
}

function SetupChecklist() {
  return (
    <ul aria-hidden="true" className="space-y-2.5">
      {outcomes.setupSteps.map((s, i) => (
        <li key={s} className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-2.5 text-[14px] text-ink ring-1 ring-line">
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full",
              i === outcomes.setupSteps.length - 1 ? "bg-brand text-ink" : "bg-ink text-white",
            )}
          >
            <Check className="size-3" strokeWidth={3} />
          </span>
          {s}
        </li>
      ))}
    </ul>
  );
}

/** Nested arcs that widen outward: each claim builds on the last. */
function CompoundingArcs() {
  const radii = [18, 34, 50, 66, 82];
  return (
    <svg aria-hidden="true" viewBox="0 0 100 100" className="h-36 w-auto sm:h-40">
      {radii.map((r, i) => (
        <path
          key={r}
          d={`M 4 ${100 - 4} A ${r} ${r} 0 0 1 ${4 + r} ${100 - 4 - r}`}
          fill="none"
          stroke={i === radii.length - 1 ? "#3DCB7F" : "#0B1410"}
          strokeOpacity={i === radii.length - 1 ? 1 : 0.15 + i * 0.15}
          strokeWidth={i === radii.length - 1 ? 5 : 3.5}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

export function Outcomes() {
  const [recovered, effortless, compounding] = outcomes.cards;

  return (
    <section aria-labelledby="outcomes-title" className="bg-white py-28 md:py-40">
      <Container>
        <SectionHeader id="outcomes-title" headline={outcomes.headline} />

        <ul className="mt-16 grid gap-4 md:mt-20 lg:grid-cols-3 lg:grid-rows-2">
          {/* Large ink tile */}
          <li className="lg:col-span-2 lg:row-span-2">
            <Reveal className="h-full">
              <div className="@container flex h-full flex-col justify-between gap-14 overflow-hidden rounded-[2rem] bg-ink p-7 text-white md:p-10 lg:min-h-[36rem]">
                <div>
                  <h3 className="text-[clamp(2.5rem,13cqw,7.5rem)] font-semibold leading-none tracking-headline">
                    {recovered.title}
                  </h3>
                  <p className="mt-5 max-w-[30ch] text-lg leading-snug text-white/70 md:text-xl">{recovered.body}</p>
                </div>
                <RisingBars />
              </div>
            </Reveal>
          </li>

          <li>
            <Reveal delay={0.08} className="h-full">
              <div className="@container flex h-full flex-col justify-between gap-10 rounded-[2rem] bg-surface p-7 md:p-9">
                <div>
                  <h3 className="text-[clamp(2.25rem,14cqw,3.75rem)] font-semibold leading-none tracking-headline text-ink">
                    {effortless.title}
                  </h3>
                  <p className="mt-4 text-[17px] leading-snug text-body">{effortless.body}</p>
                </div>
                <SetupChecklist />
              </div>
            </Reveal>
          </li>

          <li>
            <Reveal delay={0.16} className="h-full">
              <div className="@container flex h-full flex-col justify-between gap-10 rounded-[2rem] bg-surface p-7 md:p-9">
                <div>
                  <h3 className="text-[clamp(2.25rem,14cqw,3.75rem)] font-semibold leading-none tracking-headline text-ink">
                    {compounding.title}
                  </h3>
                  <p className="mt-4 text-[17px] leading-snug text-body">{compounding.body}</p>
                </div>
                <CompoundingArcs />
              </div>
            </Reveal>
          </li>
        </ul>
      </Container>
    </section>
  );
}
