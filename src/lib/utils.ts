import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge class names; later Tailwind classes win. Used by shadcn / 21st.dev components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
