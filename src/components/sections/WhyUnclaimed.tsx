import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { whyUnclaimed } from "@/content/site";

/** Why the money goes unclaimed: three reasons, styled like the facts above (thin top rules). */
export function WhyUnclaimed() {
  return (
    <section aria-labelledby="why-unclaimed-title" className="bg-background pb-14 pt-14 md:pb-20 md:pt-20">
      <Container>
        <SectionHeader id="why-unclaimed-title" headline={whyUnclaimed.headline} />

        <ul className="mt-16 grid gap-x-10 gap-y-12 md:mt-20 lg:grid-cols-3">
          {whyUnclaimed.reasons.map((reason, i) => (
            <li key={reason.title} className="min-w-0 border-t border-line pt-8">
              <Reveal delay={i * 0.08}>
                <h3 className="text-2xl font-semibold leading-tight tracking-[-0.02em] text-ink md:text-[1.75rem]">
                  {reason.title}
                </h3>
                <p className="mt-4 max-w-[34ch] text-lg leading-snug text-body">{reason.body}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="mt-14 text-xl font-semibold leading-snug text-brand-text md:mt-16 md:text-2xl">
            {whyUnclaimed.closing}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
