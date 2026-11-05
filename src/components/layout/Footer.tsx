import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Reveal } from "@/components/motion/Reveal";
import { Container } from "@/components/primitives/Container";
import { PillButton } from "@/components/primitives/PillButton";
import { VideoText } from "@/components/ui/video-text";
import { footer, site } from "@/content/site";
import { CONTACT_EMAIL, CONTACT_HREF } from "@/lib/site";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-background">
      {/* Faint accent glow rising from the bottom edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-[45%] left-1/2 aspect-[2/1] w-[160vw] max-w-[2000px] -translate-x-1/2 rounded-[50%] bg-(image:--glow-footer) md:w-[120vw]"
      />

      <Container className="relative pt-36 text-center md:pt-48">
        <Reveal>
          {/* Filled with the strip video at every width (animated WebP if autoplay is blocked).
              Mobile: three very large lines; from sm up it wraps as one balanced line. */}
          <VideoText
            as="p"
            src="/media/strip.mp4"
            fallback="/media/strip-anim.webp"
            videoClassName="brightness-[0.7] contrast-125 saturate-125"
            className="mx-auto max-w-[14ch] text-balance text-[clamp(3rem,12vw,12rem)] font-bold leading-[0.9] tracking-headline text-ink max-sm:text-[21vw] max-sm:leading-[0.86]"
          >
            {footer.tagline.map((line, i) => (
              <span key={line} className="max-sm:block">
                {i > 0 && " "}
                {line}
              </span>
            ))}
          </VideoText>
          <PillButton href={CONTACT_HREF} shine className="mt-12">
            {site.contactLabel}
          </PillButton>
        </Reveal>

        <div className="mt-32 flex flex-col items-center gap-5 border-t border-line py-8 md:mt-44 md:flex-row md:justify-between">
          <Logo mono className="text-2xl text-ink" />
          <div className="flex flex-col items-center gap-2 text-sm text-ink sm:flex-row sm:gap-8">
            {footer.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={CONTACT_HREF}
              className="underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
            >
              {CONTACT_EMAIL}
            </a>
            <p>
              © <CurrentYear /> Blend
            </p>
          </div>
        </div>

        {/* Oversized wordmark across the full container width (decorative; the logo above is the label). */}
        <div aria-hidden="true" className="@container select-none">
          <p className="footer-wordmark font-sans font-bold lowercase leading-[0.78] tracking-wordmark text-ink/8">blend</p>
        </div>
      </Container>
    </footer>
  );
}
