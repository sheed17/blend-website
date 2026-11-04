import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const variants = {
  // Bright brand fill always carries ink text (8.96:1). Never white on brand.
  brand: "bg-brand text-ink hover:bg-brand-hover active:bg-brand-hover",
  ink: "bg-ink text-white hover:bg-ink/85",
  light: "bg-white text-ink ring-1 ring-line hover:ring-ink/30",
} as const;

/** Pill-shaped link with a trailing arrow. Brand fill by default. */
export function PillButton({
  href,
  children,
  variant = "brand",
  size = "md",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: keyof typeof variants;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        "group inline-flex items-center gap-2.5 rounded-full font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-text",
        size === "md" ? "py-3.5 pl-6 pr-5 text-base" : "py-2 pl-4 pr-3.5 text-sm",
        variants[variant],
        className,
      )}
    >
      {children}
      <ArrowRight
        aria-hidden="true"
        className={cn(
          "transition-transform duration-200 motion-safe:group-hover:translate-x-0.5",
          size === "md" ? "size-[18px]" : "size-4",
        )}
        strokeWidth={2}
      />
    </a>
  );
}
