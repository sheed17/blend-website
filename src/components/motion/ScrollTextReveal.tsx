"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/primitives/Container";
import { cn } from "@/lib/utils";

function Word({
  word,
  progress,
  range,
  to,
  still,
  className,
}: {
  word: string;
  progress: MotionValue<number>;
  range: [number, number];
  to: number;
  still: boolean;
  className?: string;
}) {
  const opacity = useTransform(progress, range, [0.2, to]);
  return (
    <>
      <motion.span className={className} style={{ opacity: still ? to : opacity }}>
        {word}
      </motion.span>{" "}
    </>
  );
}

/**
 * Pinned, scroll-driven word reveal: words brighten one by one as you scroll.
 * statement → full strength · followup → paper at 90% · accent → mint at 100%.
 * Reveal starts as the section enters and completes at 60% of the scroll, so the final,
 * fully readable state holds for the rest of the pinned scroll.
 * With reduced motion it renders as plain, fully visible text.
 */
export function ScrollTextReveal({
  id,
  statement,
  followup,
  accent,
  className,
}: {
  id: string;
  statement: string;
  followup: string;
  accent?: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.5", "end end"] });

  const a = statement.split(" ");
  const b = followup.split(" ");
  const c = accent ? accent.split(" ") : [];
  const total = a.length + b.length + c.length;
  const END = 0.6;
  const range = (i: number): [number, number] => [(i / total) * END, ((i + 1) / total) * END];

  return (
    <div ref={ref} className={cn("relative", reduce ? "py-32 md:py-44" : "h-[180svh]", className)}>
      <div className={cn(!reduce && "sticky top-0 flex h-svh items-center")}>
        <Container>
          <div className="max-w-[22ch] text-balance text-[clamp(2.5rem,6.6vw,6.5rem)] font-semibold leading-[1] tracking-headline">
            <h2 id={id}>
              {a.map((w, i) => (
                <Word key={i} word={w} progress={scrollYProgress} range={range(i)} to={1} still={reduce} />
              ))}
            </h2>
            <p className="mt-[0.4em]">
              {b.map((w, i) => (
                <Word
                  key={`b${i}`}
                  word={w}
                  progress={scrollYProgress}
                  range={range(a.length + i)}
                  to={0.9}
                  still={reduce}
                />
              ))}
              {c.map((w, i) => (
                <Word
                  key={`c${i}`}
                  word={w}
                  progress={scrollYProgress}
                  range={range(a.length + b.length + i)}
                  to={1}
                  still={reduce}
                  className="text-mint"
                />
              ))}
            </p>
          </div>
        </Container>
      </div>
    </div>
  );
}
