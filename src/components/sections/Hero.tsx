import { ArrowDown } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { PillButton } from "@/components/primitives/PillButton";
import { HeroBeam } from "@/components/visuals/HeroBeam";
import { hero, site } from "@/content/site";
import { CONTACT_HREF } from "@/lib/site";

/*
 * Three grid items so the diagram can sit in the middle on phones:
 *   phones:  headline + subline → diagram → buttons (diagram on the first screen)
 *   lg+:     headline + subline / buttons stacked in 7 columns, diagram spanning both
 *            rows in the other 5.
 */
export function Hero() {
  return (
    <section data-surface="hero" className="relative overflow-hidden bg-hero pb-24 pt-10 md:pb-32 md:pt-24 lg:min-h-[calc(100svh-72px)] lg:pt-28">
      {/* Faint dot grid, fading out toward the edges */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-(image:--hero-dots) bg-size-[24px_24px] bg-center [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,#000_35%,transparent_100%)]"
      />

      <Container className="relative grid items-center gap-y-6 sm:gap-y-10 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-0">
        <div className="min-w-0 lg:col-span-7 lg:self-end">
          <Reveal>
            <h1 className="text-balance text-[clamp(2.75rem,6vw,6rem)] font-semibold leading-[0.95] tracking-headline text-hero-ink">
              {/* Space kept inside the same text node so copied/extracted text reads "commerce leaves". */}
              {`${hero.headlineLead} `}
              <span className="block">
                <span className="marker">{hero.headlineAccent}</span>
              </span>
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[36ch] text-pretty text-lg leading-relaxed text-body md:mt-8 md:text-xl">{hero.subline}</p>
          </Reveal>
        </div>

        <Reveal delay={0.25} className="min-w-0 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1">
          <HeroBeam />
        </Reveal>

        <Reveal delay={0.12} className="min-w-0 lg:col-span-7 lg:self-start lg:pt-10">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <PillButton href={CONTACT_HREF}>{site.contactLabel}</PillButton>
            <Link
              href="/how-it-works"
              className="group inline-flex items-center gap-2 rounded-sm text-base font-medium text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              {hero.secondaryCta}
              <ArrowDown
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-y-0.5"
              />
            </Link>
          </div>
          <div className="mt-6 space-y-1 text-sm text-muted-foreground">
            <p>{hero.pricing}</p>
            <p>{hero.audience}</p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
