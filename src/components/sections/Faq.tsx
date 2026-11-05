import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { faq } from "@/content/site";

/** "Questions": shadcn accordion, one open at a time. Sits above the footer's closing line. */
export function Faq() {
  return (
    <section aria-labelledby="faq-title" className="border-t border-line bg-background py-28 md:py-40">
      <Container>
        <SectionHeader id="faq-title" headline={faq.headline} />
        <Reveal className="mt-12 max-w-[880px] md:mt-16">
          <Accordion type="single" collapsible className="border-t border-line">
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
