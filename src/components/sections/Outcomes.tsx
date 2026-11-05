"use client";

import { motion } from "framer-motion";
import type { ComponentProps } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { MagicCard } from "@/components/ui/magic-card";
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

/*
 * Magic Card spotlight: mint (#8EE4B6) at low opacity, following the mouse. A touch of
 * mint on the border ring too. Mouse only, so touch devices get plain cards.
 */
const MINT = "var(--mint)";
const SPOT = {
  gradientSize: 320,
  gradientColor: MINT,
  gradientFrom: `color-mix(in srgb, ${MINT} 70%, transparent)`,
  gradientTo: `color-mix(in srgb, ${MINT} 20%, transparent)`,
} as const;

function Card({ dark = false, ...props }: { dark?: boolean } & ComponentProps<typeof MagicCard>) {
  return (
    <MagicCard
      {...SPOT}
      gradientOpacity={dark ? 0.12 : 0.3}
      background={dark ? "var(--ink)" : "var(--surface)"}
      borderColor={dark ? "var(--ink)" : "var(--surface)"}
      {...props}
      className={cn("h-full rounded-[2rem]", props.className)}
    />
  );
}

export function Outcomes() {
  const [recovered, team, brands] = outcomes.cards;

  return (
    <section aria-labelledby="outcomes-title" className="bg-background py-28 md:py-40">
      <Container>
        <SectionHeader id="outcomes-title" headline={outcomes.headline} />

        <ul className="mt-16 grid gap-4 md:mt-20 lg:grid-cols-3 lg:grid-rows-2">
          {/* Large ink tile */}
          <li className="lg:col-span-2 lg:row-span-2">
            <Reveal className="h-full">
              <Card dark>
                <div className="@container flex h-full flex-col justify-between gap-14 p-7 text-white md:p-10 lg:min-h-[36rem]">
                  <div>
                    <h3 className="text-[clamp(2.5rem,13cqw,7.5rem)] font-semibold leading-none tracking-headline">
                      {recovered.title}
                    </h3>
                    <p className="mt-5 max-w-[30ch] text-lg leading-snug text-white/70 md:text-xl">{recovered.body}</p>
                  </div>
                  <RisingBars />
                </div>
              </Card>
            </Reveal>
          </li>

          <li>
            <Reveal delay={0.08} className="h-full">
              <Card>
                <div className="@container flex h-full flex-col p-7 md:p-9">
                  <h3 className="max-w-[14ch] text-[clamp(2rem,11cqw,3rem)] font-semibold leading-[1.02] tracking-headline text-ink">
                    {team.title}
                  </h3>
                  <p className="mt-4 max-w-[34ch] text-[17px] leading-snug text-body">{team.body}</p>
                </div>
              </Card>
            </Reveal>
          </li>

          <li>
            <Reveal delay={0.16} className="h-full">
              <Card>
                <div className="@container flex h-full flex-col justify-between gap-10 p-7 md:p-9">
                  <div>
                    <h3 className="max-w-[14ch] text-[clamp(2rem,11cqw,3rem)] font-semibold leading-[1.02] tracking-headline text-ink">
                      {brands.title}
                    </h3>
                    <p className="mt-4 max-w-[34ch] text-[17px] leading-snug text-body">{brands.body}</p>
                  </div>
                  <p className="text-[clamp(1.75rem,9cqw,2.5rem)] font-semibold leading-none tracking-headline text-brand-text">
                    {outcomes.brandsLine}
                  </p>
                </div>
              </Card>
            </Reveal>
          </li>
        </ul>
      </Container>
    </section>
  );
}
