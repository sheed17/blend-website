import { CountUp } from "@/components/motion/CountUp";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { SectionHeader } from "@/components/primitives/SectionHeader";
import { facts } from "@/content/site";

/** Four industry figures with sources. Numbers in Geist Mono, counting up once. */
export function Facts() {
  return (
    <section aria-labelledby="facts-title" className="bg-white py-28 md:py-40">
      <Container>
        <SectionHeader id="facts-title" headline={facts.headline} />

        <ul className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 md:mt-20 lg:grid-cols-4">
          {facts.items.map((item, i) => (
            <li key={item.source} className="@container min-w-0 border-t border-line pt-8">
              <Reveal delay={i * 0.08}>
                <p className="font-mono text-[clamp(2.75rem,21cqw,4.5rem)] font-medium leading-none tracking-[-0.05em] text-ink tabular-nums">
                  <CountUp value={item.value} prefix={item.prefix} suffix={item.suffix} />
                </p>
                <p className="mt-6 max-w-[26ch] text-lg leading-snug text-body">{item.line}</p>
                <p className="mt-4 text-sm text-muted-foreground">Source: {item.source}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <p className="mt-16 text-sm text-muted-foreground">{facts.footnote}</p>
      </Container>
    </section>
  );
}
