/**
 * Nav → FAQ hand-off on the home page. The nav's "Pricing" and "FAQ" links fire this
 * event; the FAQ section scrolls itself into view and, for "pricing", opens the cost
 * question. Arriving from another page, the FAQ reads the same targets from the URL hash.
 */
export type FaqTarget = "faq" | "pricing";

export const FAQ_EVENT = "blend:faq";

export function isFaqTarget(value: string): value is FaqTarget {
  return value === "faq" || value === "pricing";
}

export function goToFaq(target: FaqTarget) {
  window.dispatchEvent(new CustomEvent<FaqTarget>(FAQ_EVENT, { detail: target }));
}
