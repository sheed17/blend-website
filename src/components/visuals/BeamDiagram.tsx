"use client";

import { useReducedMotion } from "framer-motion";
import { Mail, Package, PackageX, ScanBarcode, Truck, type LucideIcon } from "lucide-react";
import { createRef, useMemo, useRef, type RefObject } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { beam } from "@/content/site";
import { colors } from "@/lib/colors";
import { cn } from "@/lib/utils";

/*
 * Signals → Blend → your brands, built on Magic UI's Animated Beam
 * ("Multiple Inputs" layout). Icons only: no carrier names or logos.
 *
 * - No `step`: hero mode. Every signal pulses into Blend; Blend pulses to "$".
 * - `step` 0 / 1 / 2 (How it works): 0 highlights one signal, 1 sends it into
 *   Blend, 2 sends the money on to "$".
 * With prefers-reduced-motion, paths render static with no traveling pulse.
 */

/** Same order as beam.signals in site.ts. */
const ICONS: LucideIcon[] = [PackageX, Package, Mail, ScanBarcode, Truck];

type Step = 0 | 1 | 2;
type Size = "hero" | "step";

/* Hero is compact at lg (narrow 5-column slot) and largest at xl. */
const SIZES: Record<Size, Record<string, string>> = {
  hero: {
    node: "size-11 rounded-xl sm:size-14 sm:rounded-2xl lg:size-12 lg:rounded-xl xl:size-[4.25rem] xl:rounded-2xl",
    icon: "size-5 sm:size-6 lg:size-5 xl:size-7",
    gap: "gap-3 sm:gap-4 lg:gap-3.5 xl:gap-5",
    circle: "size-[4.5rem] sm:size-24 lg:size-20 xl:size-28",
    mark: "h-12 sm:h-16 lg:h-13 xl:h-18",
    dollar: "text-2xl sm:text-3xl lg:text-2xl xl:text-4xl",
    right: "w-[5.5rem] sm:w-32 lg:w-28 xl:w-36",
    caption: "text-[12px] xl:text-[13px]",
  },
  step: {
    node: "size-11 rounded-xl sm:size-12",
    icon: "size-5",
    gap: "gap-3",
    circle: "size-[4.5rem] sm:size-20",
    mark: "h-12 sm:h-13",
    dollar: "text-2xl",
    right: "w-[5.5rem] sm:w-28",
    caption: "text-[12px]",
  },
};

const SHADOW = "shadow-[0_1px_2px_color-mix(in_srgb,var(--ink)_6%,transparent),0_8px_24px_-12px_color-mix(in_srgb,var(--ink)_20%,transparent)]";
const HUB = "border-hub-line bg-hub shadow-(--hub-shadow)";
const STAGGER = 0.55; // seconds between signal pulses
const DURATION = 2.8;

function SignalNode({
  ref,
  icon: Icon,
  label,
  highlighted,
  size,
}: {
  ref: RefObject<HTMLDivElement | null>;
  icon: LucideIcon;
  label: string;
  highlighted: boolean;
  size: Size;
}) {
  const s = SIZES[size];
  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={cn(
        "group relative z-10 flex items-center justify-center border transition-colors duration-500 hover:z-20",
        s.node,
        highlighted ? "border-brand bg-brand" : "border-node-line bg-node",
        SHADOW,
      )}
    >
      <Icon aria-hidden="true" className={cn("text-ink", s.icon)} strokeWidth={1.75} />
      {/* Hover tooltip (screen readers get the aria-label instead) */}
      <span
        aria-hidden="true"
        className="invisible absolute left-full top-1/2 ml-2.5 -translate-y-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[12px] font-medium leading-none text-white opacity-0 shadow-lg transition-opacity duration-150 group-hover:visible group-hover:opacity-100"
      >
        {label}
      </span>
    </div>
  );
}

/** Pulse beam: neutral path + bright accent pulse. Static accent path when done or not animated. */
function Pulse({
  containerRef,
  fromRef,
  toRef,
  animated,
  delay = 0,
  width = 2.5,
  green = false,
  done = false,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  fromRef: RefObject<HTMLElement | null>;
  toRef: RefObject<HTMLElement | null>;
  animated: boolean;
  delay?: number;
  width?: number;
  /** Green base line (the money path, or the claim being worked). */
  green?: boolean;
  /** Completed: solid green, static. */
  done?: boolean;
}) {
  const moving = animated && !done;
  return (
    <AnimatedBeam
      containerRef={containerRef}
      fromRef={fromRef}
      toRef={toRef}
      animated={moving}
      pathColor={green || done ? colors.beam : colors.beamTrack}
      pathOpacity={done || (green && !moving) ? 1 : green ? 0.4 : 0.45}
      pathWidth={width}
      gradientStartColor={colors.beam}
      gradientStopColor={colors.beam}
      delay={delay}
      duration={DURATION}
    />
  );
}

export function BeamDiagram({
  step,
  highlight = 0,
  size = "step",
  className,
}: {
  step?: Step;
  /** Which signal is highlighted in step mode (index into beam.signals). */
  highlight?: number;
  size?: Size;
  className?: string;
}) {
  const reduce = useReducedMotion() ?? false;
  const animated = !reduce;
  const hero = step === undefined;
  const s = SIZES[size];

  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const moneyRef = useRef<HTMLDivElement>(null);
  const signalRefs = useMemo(() => beam.signals.map(() => createRef<HTMLDivElement>()), []);

  const label = hero ? beam.label : beam.stepLabels[step];
  const moneyLit = hero || step === 2;

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={label}
      className={cn("relative flex w-full items-center justify-between", className)}
    >
      {/* Signals */}
      <div className={cn("flex flex-col", s.gap)}>
        {beam.signals.map((signal, i) => (
          <SignalNode
            key={signal}
            ref={signalRefs[i]}
            icon={ICONS[i]}
            label={signal}
            highlighted={!hero && i === highlight}
            size={size}
          />
        ))}
      </div>

      {/* Blend (shared LogoMark) */}
      <div
        ref={centerRef}
        role="img"
        aria-label={beam.centerLabel}
        className={cn(
          "relative z-10 flex shrink-0 items-center justify-center rounded-full border",
          HUB,
          s.circle,
        )}
      >
        <LogoMark className={cn("w-auto", s.mark)} />
      </div>

      {/* Your brands: "$" is the same size as the center circle. The invisible
          caption above keeps the circle vertically centered. Copies of the caption that
          shouldn't add page text (this spacer, and the How-it-works diagrams, since the
          hero already says it) are drawn from data-caption with CSS generated content. */}
      <div className={cn("flex shrink-0 flex-col items-center gap-2.5", s.right)}>
        <p
          aria-hidden="true"
          data-caption={beam.moneyCaption}
          className={cn("invisible text-center leading-tight before:content-[attr(data-caption)]", s.caption)}
        />
        <div
          ref={moneyRef}
          aria-hidden="true"
          className={cn(
            "relative z-10 flex items-center justify-center rounded-full border font-mono font-medium text-ink transition-colors duration-500",
            s.circle,
            s.dollar,
            moneyLit ? "border-brand bg-brand" : "border-node-line bg-node",
            SHADOW,
          )}
        >
          $
        </div>
        {hero ? (
          <p className={cn("text-center leading-tight text-body", s.caption)}>{beam.moneyCaption}</p>
        ) : (
          <p
            aria-hidden="true"
            data-caption={beam.moneyCaption}
            className={cn("text-center leading-tight text-body before:content-[attr(data-caption)]", s.caption)}
          />
        )}
      </div>

      {/* Beams */}
      {hero ? (
        <>
          {signalRefs.map((r, i) => (
            <Pulse key={i} containerRef={containerRef} fromRef={r} toRef={centerRef} animated={animated} delay={i * STAGGER} />
          ))}
          <Pulse containerRef={containerRef} fromRef={centerRef} toRef={moneyRef} animated={animated} delay={0.9} width={3.5} green />
        </>
      ) : (
        <>
          {/* Quiet neutral paths from every signal, for context */}
          {signalRefs.map((r, i) =>
            i === highlight && step >= 1 ? null : (
              <AnimatedBeam
                key={i}
                containerRef={containerRef}
                fromRef={r}
                toRef={centerRef}
                animated={false}
                pathColor={colors.beamTrack}
                pathOpacity={0.3}
              />
            ),
          )}
          {step >= 1 && (
            <Pulse
              key={`claim-${step}`}
              containerRef={containerRef}
              fromRef={signalRefs[highlight]}
              toRef={centerRef}
              animated={animated}
              green
              done={step === 2}
            />
          )}
          {step === 2 && (
            <Pulse containerRef={containerRef} fromRef={centerRef} toRef={moneyRef} animated={animated} width={3.5} green />
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------------------------
 * Mobile / tablet step visuals (How it works, below lg). Instead of repeating the full
 * diagram three times, each step shows only its part of the flow, static:
 *   0 Find   → the five signals, the claim's signal highlighted
 *   1 File   → that signal → Blend
 *   2 Return → Blend → "$"
 * ---------------------------------------------------------------------------------------- */

const STEP_NODE = "flex size-11 shrink-0 items-center justify-center rounded-xl border";
const STEP_CIRCLE = "flex size-[4.5rem] shrink-0 items-center justify-center rounded-full border";
const STEP_LINE = "h-[3px] w-12 shrink-0 rounded-full bg-(--beam) sm:w-20";

function StaticSignal({ index, highlighted }: { index: number; highlighted: boolean }) {
  const Icon = ICONS[index];
  return (
    <div className={cn(STEP_NODE, highlighted ? "border-brand bg-brand" : "border-node-line bg-node", SHADOW)}>
      <Icon aria-hidden="true" className="size-5 text-ink" strokeWidth={1.75} />
    </div>
  );
}

function StaticBlend() {
  return (
    <div className={cn(STEP_CIRCLE, HUB)}>
      <LogoMark className="h-12 w-auto" />
    </div>
  );
}

export function StepVisual({ step, highlight = 0, className }: { step: Step; highlight?: number; className?: string }) {
  return (
    <div role="img" aria-label={beam.stepLabels[step]} className={cn("flex items-center justify-center", className)}>
      {step === 0 && (
        <div className="flex gap-2.5">
          {beam.signals.map((signal, i) => (
            <StaticSignal key={signal} index={i} highlighted={i === highlight} />
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="flex items-center gap-3">
          <StaticSignal index={highlight} highlighted />
          <span className={STEP_LINE} />
          <StaticBlend />
        </div>
      )}

      {step === 2 && (
        <div className="flex items-center gap-3">
          <StaticBlend />
          <span className={STEP_LINE} />
          <div
            className={cn(
              STEP_CIRCLE,
              "border-brand bg-brand font-mono text-2xl font-medium text-ink",
              SHADOW,
            )}
          >
            $
          </div>
        </div>
      )}
    </div>
  );
}
