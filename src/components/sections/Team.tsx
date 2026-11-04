import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { team } from "@/content/site";

/** "Who we are": two people side by side (stacked below md). Text only, no photos. */
export function Team() {
  return (
    <section aria-labelledby="team-title" className="border-t border-line bg-white py-20 md:py-28">
      <Container>
        <Reveal>
          <h2
            id="team-title"
            className="text-balance text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-headline text-ink"
          >
            {team.headline}
          </h2>
          <ul className="mt-10 grid max-w-[920px] gap-10 md:mt-12 md:grid-cols-2 md:gap-16">
            {team.people.map((person, i) => (
              <li key={i}>
                <p className="text-xl font-semibold tracking-[-0.01em] text-ink">{person.name}</p>
                <p className="mt-2 text-lg leading-snug text-body">{person.line}</p>
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${person.name} on ${team.linkLabel}`}
                  className="mt-3 inline-block text-sm text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-text"
                >
                  {team.linkLabel}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
