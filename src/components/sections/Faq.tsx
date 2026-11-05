"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faq } from "@/content/site";
import { FAQ_EVENT, isFaqTarget, type FaqTarget } from "@/lib/faq-nav";

/** Accordion value of the question the nav's "Pricing" link opens. */
const PRICING = `q${faq.items.findIndex((item) => "pricing" in item)}`;

/**
 * "Questions": shadcn accordion, one open at a time. Sits above the footer's closing line.
 *
 * id="faq" is the nav's scroll target. The negative scroll margin skips most of the
 * section's top padding, so the heading lands just under the floating nav.
 */
export function Faq() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState("");

  useEffect(() => {
    const go = (target: FaqTarget) => {
      if (target === "pricing") setOpen(PRICING);
      // Next frame, so the opened answer is laid out before the scroll is measured.
      requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    };
    const onEvent = (e: Event) => go((e as CustomEvent<FaqTarget>).detail);
    window.addEventListener(FAQ_EVENT, onEvent);

    // Arrived from another page via /#faq or /#pricing.
    const hash = window.location.hash.slice(1);
    if (isFaqTarget(hash)) go(hash);

    return () => window.removeEventListener(FAQ_EVENT, onEvent);
  }, []);

  return (
    <section
      ref={ref}
      id="faq"
      aria-labelledby="faq-title"
      className="-scroll-mt-6 border-t border-line bg-background py-28 md:-scroll-mt-18 md:py-40"
    >
      <Container>
        <SectionHeader id="faq-title" headline={faq.headline} />
        <Reveal className="mt-12 max-w-[880px] md:mt-16">
          <Accordion type="single" collapsible value={open} onValueChange={setOpen} className="border-t border-line">
            {faq.items.map((item, i) => (
              <AccordionItem key={item.q} value={`q${i}`} className="border-line last:border-b">
                <AccordionTrigger className="items-center rounded-sm py-6 text-xl font-semibold tracking-[-0.01em] text-ink hover:no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus focus-visible:ring-0 md:text-2xl [&>svg]:size-5 [&>svg]:translate-y-0">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="max-w-[60ch] pb-7 text-lg leading-relaxed text-body">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </Container>
    </section>
  );
}
