"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { AnimatedList } from "@/components/ui/animated-list";
import { BorderBeam } from "@/components/ui/border-beam";
import { ParcelArt } from "@/components/visuals/ParcelArt";
import { hero } from "@/content/site";
import { cn } from "@/lib/utils";

/** ms between labels dropping in. */
const DROP = 2000;
/** ms from a label mounting to the stamp: ~0.4s spring landing + 1.2s as a problem. */
const STAMP_AFTER = 1600;

type Claim = (typeof hero.claims)[number];

/** Stable pseudo-random in [0, 1) from a string, so server and client agree. */
function rand(seed: string, salt: number) {
  let h = salt * 374761393;
  for (let i = 0; i < seed.length; i++) h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
  const x = Math.sin(h) * 43758.5453;
  return x - Math.floor(x);
}

/*
 * Tear-off edge: semicircle bites down the left side, one per 12px. The label is two
 * masked layers: the outer one (the bezel's gradient border) has 5px bites, the inner
 * one (white, inset 1px) has 6px bites at the same centers, so the 1px border follows
 * each notch. CSS masks clip box-shadows, so the drop shadow is a filter on the wrapper.
 */
const notches = (r: number, dy: number): CSSProperties => {
  const mask = `radial-gradient(circle ${r}px at 0 6px, transparent ${r - 0.5}px, #000 ${r}px) 0 ${dy}px / 100% 12px repeat-y`;
  return { mask, WebkitMask: mask };
};

/** Decorative barcode: fixed bar widths, laid out once with 1-2 unit gaps. */
const BAR_WIDTHS = [2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 2, 1, 3, 1];
const BARS = BAR_WIDTHS.reduce<{ x: number; w: number }[]>((bars, w, i) => {
  const prev = bars[i - 1];
  const x = prev ? prev.x + prev.w + (i % 3 === 1 ? 2 : 1) : 0;
  return [...bars, { x, w }];
}, []);
const BARS_WIDTH = BARS[BARS.length - 1].x + BARS[BARS.length - 1].w;

function Barcode() {
  return (
    <svg viewBox={`0 0 ${BARS_WIDTH} 1`} preserveAspectRatio="none" className="h-12 w-6 shrink-0 self-center fill-ink/70">
      {BARS.map((b, i) => (
        <rect key={i} x={b.x} y={0} width={b.w} height={1} />
      ))}
    </svg>
  );
}

/** One shipping label: lands tilted in the pile, then gets a CLAIMED stamp ~1.2s later. */
function ClaimLabel({ claim }: { claim: Claim }) {
  const id = useId();
  const tilt = rand(id, 1) * 6 - 3; // -3° to 3°
  const shift = rand(id, 2) * 16 - 8; // -8px to 8px
  const stampTilt = -8 - rand(id, 3) * 4; // -8° to -12°
  const [stamped, setStamped] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStamped(true), STAMP_AFTER);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{ rotate: `${tilt}deg`, translate: `${shift}px 0` }}
      className="bezel relative [--bezel-r:0.5rem]"
    >
      <div className="[filter:drop-shadow(0_1px_1px_rgb(11_20_16/0.04))_drop-shadow(0_8px_12px_rgb(11_20_16/0.09))]">
        <div style={notches(5, 0)} className="relative rounded-lg bg-(image:--bezel-border) p-px">
          <div
            style={notches(6, -1)}
            className="flex items-stretch gap-3.5 rounded-[7px] bg-white py-3.5 pl-5 pr-4 text-ink shadow-[inset_0_1px_0_var(--bezel-highlight)]"
          >
            <div className="size-10 shrink-0 self-center">
              <ParcelArt damaged={claim.damaged} />
            </div>
            <div className="min-w-0 flex-1">
              <motion.span
                initial={false}
                animate={{ opacity: stamped ? 0 : 1 }}
                transition={{ duration: 0.25, delay: stamped ? 0.12 : 0 }}
                className={cn(
                  "inline-block rounded px-1.5 py-0.5 text-[11px] font-semibold uppercase leading-none tracking-[0.08em]",
                  claim.damaged ? "bg-status-red-tint text-status-red" : "bg-status-amber-tint text-status-amber",
                )}
              >
                {claim.status}
              </motion.span>
              <p className="mt-1.5 truncate text-[15px] font-semibold leading-snug">{claim.title}</p>
              <p className="truncate text-[13px] leading-snug text-muted-foreground">{claim.detail}</p>
            </div>
            <Barcode />
          </div>

          {/* Newest label only: a beam runs around it until the stamp lands. */}
          <AnimatePresence>
            {!stamped && (
              <motion.div
                key="beam"
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
              >
                <BorderBeam size={70} duration={3} borderWidth={1.5} colorFrom="var(--mint)" colorTo="var(--brand)" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* The stamp: drops from 1.4x, a small bounce, ~85% like ink. */}
      <div className="pointer-events-none absolute inset-y-0 right-8 flex items-center pt-1">
        <motion.div
          initial={false}
          animate={stamped ? { opacity: 0.85, scale: 1 } : { opacity: 0, scale: 1.4 }}
          transition={
            stamped
              ? { scale: { type: "spring", stiffness: 520, damping: 16 }, opacity: { duration: 0.12 } }
              : { duration: 0 }
          }
          style={{ rotate: stampTilt }}
          className="rounded-[4px] border-[2.5px] border-stamp px-2 py-1 text-[15px] font-extrabold uppercase leading-none tracking-[0.12em] text-stamp"
        >
          {hero.stamp}
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Hero visual: problems land one at a time as shipping labels in a loose pile (Magic UI
 * Animated List, newest on top), each stamped CLAIMED ~1.2s after landing. Four on
 * screen, the oldest fades out at the bottom, loops forever, and holds still while the
 * hero is off screen.
 *
 * Decorative: the loop would be noise to a screen reader, and the hero copy says it.
 */
export function ClaimStack() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.2 });

  return (
    <div ref={ref} aria-hidden="true" className="relative">
      <div className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(image:--glow-hero)" />
      {/*
       * Fixed height (4 labels, overlapping a few px) so the hero never moves while the
       * pile cycles. Side padding leaves room for the tilt. Newer labels sit above older
       * ones (z-index by position).
       */}
      <div className="relative -mx-4 h-[27.5rem] overflow-hidden px-4 pt-3 [mask-image:linear-gradient(to_bottom,#000_84%,transparent)] sm:mx-auto sm:max-w-[400px] sm:px-5">
        <AnimatedList
          delay={DROP}
          loop
          max={4}
          paused={!inView}
          className="gap-0 [&>*]:relative [&>*+*]:-mt-1.5 [&>*:nth-child(1)]:z-[5] [&>*:nth-child(2)]:z-[4] [&>*:nth-child(3)]:z-[3] [&>*:nth-child(4)]:z-[2] [&>*:nth-child(5)]:z-[1]"
        >
          {hero.claims.map((c) => (
            <ClaimLabel key={c.title} claim={c} />
          ))}
        </AnimatedList>
      </div>
    </div>
  );
}
