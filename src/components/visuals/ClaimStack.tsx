"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AnimatedList } from "@/components/ui/animated-list";
import { hero } from "@/content/site";

/** ms between cards dropping in. */
const DROP = 2000;
/** ms from a card mounting to its flip: ~0.4s spring landing + 1.2s as a problem. */
const FLIP_AFTER = 1600;

const FACE =
  "col-start-1 row-start-1 flex flex-col justify-center gap-0.5 rounded-2xl border px-5 py-4 backface-hidden";

type Claim = (typeof hero.claims)[number];

/** One problem card: white face drops in, then flips over to the green "Claimed ✓" face. */
function ClaimCard({ claim }: { claim: Claim }) {
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setClaimed(true), FLIP_AFTER);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="perspective-[900px]">
      <motion.div
        className="grid transform-3d"
        initial={false}
        animate={{ rotateX: claimed ? -180 : 0 }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      >
        <div className={`${FACE} border-line bg-white shadow-[0_12px_32px_-20px_color-mix(in_srgb,var(--ink)_30%,transparent)]`}>
          <p className="text-base font-semibold text-ink">{claim.title}</p>
          <p className="text-sm text-muted-foreground">{claim.detail}</p>
        </div>
        <div
          className={`${FACE} rotate-x-180 border-brand bg-brand shadow-[0_12px_32px_-18px_color-mix(in_srgb,var(--deep)_55%,transparent)]`}
        >
          <p className="text-base font-semibold text-ink">{hero.claimedLabel}</p>
          <p className="text-sm text-ink/75">{claim.detail}</p>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Hero visual: problems drop in one at a time (Magic UI Animated List, newest on top),
 * each flips to "Claimed ✓" ~1.2s after landing. Four on screen, the oldest fades out at
 * the bottom, loops forever, and holds still while the hero is off screen.
 *
 * Decorative: the loop would be noise to a screen reader, and the hero copy says it.
 */
export function ClaimStack() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });

  return (
    <div ref={ref} aria-hidden="true" className="relative">
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(image:--glow-hero)" />
      {/* Fixed height (4 cards + gaps) so the hero never moves while the stack cycles. */}
      <div className="relative mx-auto h-[23.5rem] w-full overflow-hidden px-1 pt-1 [mask-image:linear-gradient(to_bottom,#000_82%,transparent)] sm:max-w-[360px] lg:h-[24rem]">
        <AnimatedList delay={DROP} loop max={4} paused={!inView} className="gap-3">
          {hero.claims.map((c) => (
            <ClaimCard key={c.title} claim={c} />
          ))}
        </AnimatedList>
      </div>
    </div>
  );
}
