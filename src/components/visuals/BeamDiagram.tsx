"use client";

import { Mail, Package, PackageX, ScanBarcode, Truck, type LucideIcon } from "lucide-react";
import { createRef, useMemo, useRef, type RefObject } from "react";
import { LogoMark } from "@/components/brand/LogoMark";
import { AnimatedBeam } from "@/components/ui/animated-beam";
import { ParcelFlow } from "@/components/visuals/ParcelFlow";
import { beam } from "@/content/site";
import { colors } from "@/lib/colors";
import { cn } from "@/lib/utils";

/*
 * Hero diagram: signals → Blend → your brands, laid out like Magic UI's Animated Beam
 * ("Multiple Inputs"). Icons only: no carrier names or logos. Quiet static beams carry
 * the parcel traffic (ParcelFlow): damaged and lost parcels go into Blend, $ coins
 * come out to "$".
 */

/** Same order as beam.signals in site.ts. */
const ICONS: LucideIcon[] = [PackageX, Package, Mail, ScanBarcode, Truck];

/*
 * Phones: sized in vw so the whole diagram scales with the screen and always fits
 * (capped at the sm size). sm: roomy. lg: compact (narrow 5-column slot). xl: largest.
 */
const S = {
  node: "size-[min(11vw,3.5rem)] rounded-[min(3vw,1rem)] sm:size-14 sm:rounded-2xl lg:size-12 lg:rounded-xl xl:size-[4.25rem] xl:rounded-2xl",
  icon: "size-[min(5.2vw,1.5rem)] sm:size-6 lg:size-5 xl:size-7",
  gap: "gap-[min(2.8vw,1rem)] sm:gap-4 lg:gap-3.5 xl:gap-5",
  circle: "size-[min(19vw,6rem)] sm:size-24 lg:size-20 xl:size-28",
  mark: "h-[min(12.5vw,4rem)] sm:h-16 lg:h-13 xl:h-18",
  dollar: "text-[min(6.4vw,1.875rem)] sm:text-3xl lg:text-2xl xl:text-4xl",
  right: "w-[min(23vw,8rem)] sm:w-32 lg:w-28 xl:w-36",
  caption: "text-[12px] xl:text-[13px]",
};

const SHADOW = "shadow-[0_1px_2px_color-mix(in_srgb,var(--ink)_6%,transparent),0_8px_24px_-12px_color-mix(in_srgb,var(--ink)_20%,transparent)]";
const HUB = "border-hub-line bg-hub shadow-(--hub-shadow)";

function SignalNode({ ref, icon: Icon, label }: { ref: RefObject<HTMLDivElement | null>; icon: LucideIcon; label: string }) {
  return (
    <div
      ref={ref}
      role="img"
      aria-label={label}
      className={cn(
        "group relative z-10 flex items-center justify-center border border-node-line bg-node hover:z-20",
        S.node,
        SHADOW,
      )}
    >
      <Icon aria-hidden="true" className={cn("text-ink", S.icon)} strokeWidth={1.75} />
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

export function BeamDiagram({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const moneyRef = useRef<HTMLDivElement>(null);
  const signalRefs = useMemo(() => beam.signals.map(() => createRef<HTMLDivElement>()), []);

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={beam.label}
      className={cn("relative flex w-full items-center justify-between", className)}
    >
      {/* Signals */}
      <div className={cn("flex flex-col", S.gap)}>
        {beam.signals.map((signal, i) => (
          <SignalNode key={signal} ref={signalRefs[i]} icon={ICONS[i]} label={signal} />
        ))}
      </div>

      {/* Blend (shared LogoMark) */}
      <div
        ref={centerRef}
        role="img"
        aria-label={beam.centerLabel}
        className={cn("relative z-10 flex shrink-0 items-center justify-center rounded-full border", HUB, S.circle)}
      >
        <LogoMark className={cn("w-auto", S.mark)} />
      </div>

      {/* Your brands: "$" is the same size as the center circle. The invisible caption
          above keeps the circle vertically centered; it's drawn from data-caption with CSS
          generated content so it doesn't add page text. */}
      <div className={cn("flex shrink-0 flex-col items-center gap-2.5", S.right)}>
        <p
          aria-hidden="true"
          data-caption={beam.moneyCaption}
          className={cn("invisible text-center leading-tight before:content-[attr(data-caption)]", S.caption)}
        />
        <div
          ref={moneyRef}
          aria-hidden="true"
          className={cn(
            "relative z-10 flex items-center justify-center rounded-full border border-brand bg-brand font-mono font-medium text-ink",
            S.circle,
            S.dollar,
            SHADOW,
          )}
        >
          $
        </div>
        <p className={cn("text-center leading-tight text-body", S.caption)}>{beam.moneyCaption}</p>
      </div>

      {/* Beams */}
      {signalRefs.map((r, i) => (
        <AnimatedBeam
          key={i}
          containerRef={containerRef}
          fromRef={r}
          toRef={centerRef}
          animated={false}
          pathColor={colors.beamTrack}
          pathOpacity={0.45}
          pathWidth={2.5}
        />
      ))}
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={centerRef}
        toRef={moneyRef}
        animated={false}
        pathColor={colors.beam}
        pathOpacity={0.5}
        pathWidth={3.5}
      />
      <ParcelFlow containerRef={containerRef} laneRefs={signalRefs} hubRef={centerRef} moneyRef={moneyRef} />
    </div>
  );
}
