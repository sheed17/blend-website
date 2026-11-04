import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Horizontal gutters + max width. 16px minimum side gutter on mobile. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}
