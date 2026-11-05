import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { facts } from "@/content/site";

/** Industry figures, each linked to its source. Numbers in Geist Mono, counting up once. */
export function Facts() {
  return (
    <section aria-labelledby="facts-title" className="bg-background pb-14 pt-28 md:pb-20 md:pt-40">
      <Container>
        <SectionHeader id="facts-title" headline={facts.headline} />

        <ul className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 md:mt-20">
          {facts.items.map((item, i) => (
            <li key={item.source} className="@container min-w-0 border-t border-line pt-8">
              <Reveal delay={i * 0.08}>
                <p className="font-mono text-[clamp(2.5rem,18cqw,3.75rem)] font-medium leading-none tracking-[-0.05em] text-ink tabular-nums">
                  <CountUp value={item.value} prefix={item.prefix} suffix={item.suffix} />
                </p>
                <p className="mt-6 max-w-[26ch] text-lg leading-snug text-body">{item.line}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-muted-foreground/40 underline-offset-4 transition-colors hover:text-ink hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
                  >
                    {item.source}
                  </a>
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-16 text-sm text-muted-foreground">{facts.footnote}</p>
      </Container>
    </section>
  );
}
