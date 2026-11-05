import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { vision } from "@/content/site";

export function Vision() {
  return (
    <section aria-labelledby="vision" className="border-t border-line bg-background py-28 md:py-40">
      <Container>
        <Reveal>
          <div className="max-w-[20ch] text-balance text-[clamp(2.75rem,6.8vw,6.5rem)] font-semibold leading-[0.98] tracking-headline">
            <h2 id="vision" className="text-ink">
              {vision.statement}
            </h2>
            <p className="mt-[0.3em] text-muted-foreground">{vision.followup}</p>
          </div>
          <p className="mt-12 max-w-[46ch] text-lg leading-relaxed text-body md:text-xl">{vision.note}</p>
        </Reveal>
      </Container>
    </section>
  );
}
