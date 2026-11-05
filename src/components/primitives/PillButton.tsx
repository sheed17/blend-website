import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { ShineBorder } from "@/components/ui/shine-border";
import { cn } from "@/lib/utils";

const variants = {
  // Theme primary button (--button*): green = accent fill + ink; kinetic = ink fill + white, lime hover ring.
  brand: "bg-button text-button-ink ring-button-ring hover:bg-button-hover hover:ring-2 active:bg-button-hover",
  ink: "bg-ink text-white hover:bg-ink/85",
  light: "bg-white text-ink ring-1 ring-line hover:ring-ink/30",
} as const;

/** Pill-shaped link with a trailing arrow. Theme primary button by default. */
export function PillButton({
  href,
  children,
  variant = "brand",
  size = "md",
  shine = false,
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: "sm" | "md";
  /** Subtle animated Shine Border (theme --shine-a/b). Use once. */
  shine?: boolean;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus",
        size === "md" ? "py-3.5 pl-6 pr-5 text-base" : "py-2 pl-4 pr-3.5 text-sm",
        variants[variant],
        shine && "relative",
        className,
      )}
    >
      {shine && (
        <ShineBorder
          borderWidth={2}
          duration={10}
          shineColor={["var(--shine-a)", "var(--shine-b)"]}
        />
      )}
      {children}
      <ArrowRight
        aria-hidden="true"
        className={cn(
          "transition-transform duration-200 group-hover:translate-x-0.5",
          size === "md" ? "size-[18px]" : "size-4",
        )}
        strokeWidth={2}
      />
    </a>
  );
}
