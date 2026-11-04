import { cacheLife } from "next/cache";
import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { PillButton } from "@/components/primitives/PillButton";
import { footer, site } from "@/content/site";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white">
      {/* Faint green glow rising from the bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[45%] left-1/2 aspect-[2/1] w-[160vw] max-w-[2000px] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(61,203,127,0.22),rgba(236,249,242,0.8)_55%,rgba(255,255,255,0)_100%)] md:w-[120vw]"
      />

      <Container className="relative pt-36 text-center md:pt-48">
        <Reveal>
          <p className="mx-auto max-w-[14ch] text-balance text-[clamp(3rem,8vw,7.5rem)] font-semibold leading-[0.95] tracking-headline text-ink">
            {footer.tagline}
          </p>
          <PillButton href={`mailto:${site.email}`} className="mt-12">
            {site.contactLabel}
          </PillButton>
        </Reveal>

        <div className="mt-32 flex flex-col items-center gap-5 border-t border-line py-8 md:mt-44 md:flex-row md:justify-between">
          <Logo mono className="text-2xl text-ink" />
          <div className="flex flex-col items-center gap-2 text-sm text-ink sm:flex-row sm:gap-8">
            <a
              href={`mailto:${site.email}`}
              className="underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-text"
            >
              {site.email}
            </a>
            <p>
              © <CurrentYear /> Blend
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
