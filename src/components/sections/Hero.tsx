import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { PillButton } from "@/components/primitives/PillButton";
import { HeroBeam } from "@/components/visuals/HeroBeam";
import { hero, site } from "@/content/site";
import { CONTACT_HREF } from "@/lib/site";

export function Hero() {
  return (
    <section className="relative overflow-hidden pb-24 pt-16 md:pb-32 md:pt-24 lg:min-h-[calc(100svh-72px)] lg:pt-28">
      <Container className="relative grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="min-w-0 lg:col-span-7">
          <Reveal>
            <h1 className="text-balance text-[clamp(2.75rem,6vw,6rem)] font-semibold leading-[0.95] tracking-headline text-ink">
              {/* Space kept inside the same text node so copied/extracted text reads "commerce leaves". */}
              {`${hero.headlineLead} `}
              <span className="block">
                <span className="marker">{hero.headlineAccent}</span>
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-8 max-w-[36ch] text-pretty text-lg leading-relaxed text-body md:text-xl">{hero.subline}</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <PillButton href={CONTACT_HREF}>{site.contactLabel}</PillButton>
              <Link
                href="/how-it-works"
                className="group inline-flex items-center gap-2 rounded-sm text-base font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-text"
              >
                {hero.secondaryCta}
                <ArrowDown
                  aria-hidden="true"
                  className="size-4 transition-transform motion-safe:group-hover:translate-y-0.5"
                />
              </Link>
            </div>
            <div className="mt-6 space-y-1 text-sm text-muted-foreground">
              <p>{hero.pricing}</p>
              <p>{hero.audience}</p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25} className="min-w-0 lg:col-span-5">
          <HeroBeam />
        </Reveal>
      </Container>
    </section>
  );
}
