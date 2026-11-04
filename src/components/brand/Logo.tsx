import { cn } from "@/lib/utils";
import { LogoMark } from "./LogoMark";

/**
 * Lockup: LogoMark + lowercase "blend" wordmark (Geist Sans 700, -0.045em). Used by
 * the nav and footer. Sized in em, so set the size with a text-* class.
 *
 * The visible tiles are ~1.25× the wordmark's cap height (Geist cap height ≈ 0.7em → ~0.88em).
 * The SVG box is 48/32 of that, and the negative inline margin trims its side padding
 * so the gap and the left edge are measured from the tiles themselves.
 */
export function Logo({ className, mono = false }: { className?: string; mono?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-[0.3em]", className)}>
      <LogoMark mono={mono} className="-mx-[0.166em] size-[1.33em] shrink-0" />
      <span className="font-sans font-bold lowercase leading-none tracking-wordmark">blend</span>
    </span>
  );
}

export { LogoMark };
