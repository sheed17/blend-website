import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Container } from "@/components/primitives/Container";
import { PillButton } from "@/components/primitives/PillButton";
import { howItWorksPage as page } from "@/content/how-it-works";
import { site } from "@/content/site";
import { CONTACT_HREF, socialMetadata } from "@/lib/site";

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  ...socialMetadata(page.meta.title, page.meta.description),
};

/*
 * Plain reference page: one left-aligned text column (max 720px), H2 sections,
 * H3 subsections, one real table. Headings get scroll-margin so the 64px sticky
 * nav never covers them when linked to.
 */

const P = "mt-4 text-lg leading-relaxed text-body";

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2
      id={id}
      className="scroll-mt-24 text-balance text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1] tracking-headline text-ink"
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return (
    <h3 className="mt-16 scroll-mt-24 text-2xl font-semibold leading-tight tracking-[-0.02em] text-ink md:text-[1.75rem]">
      {children}
    </h3>
  );
}

function CarrierTable() {
  const t = page.claims.carrierTable;
  return (
    <div
      role="region"
      aria-label={t.headline}
      tabIndex={0}
      className="mt-6 overflow-x-auto border border-line focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-text"
    >
      <table className="w-full min-w-[560px] border-collapse text-left text-[15px] leading-snug">
        <thead>
          <tr className="border-b border-line bg-surface">
            <th scope="col" className="w-[34%] px-4 py-3">
              <span className="sr-only">{t.rowHeader}</span>
            </th>
            {t.carriers.map((carrier) => (
              <th key={carrier} scope="col" className="border-l border-line px-4 py-3 font-semibold text-ink">
                {carrier}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {t.rows.map((row) => (
            <tr key={row.label} className="border-b border-line last:border-b-0">
              <th scope="row" className="px-4 py-3 align-top font-medium text-ink">
                {row.label}
              </th>
              {row.values.map((value, i) => (
                <td key={t.carriers[i]} className="border-l border-line px-4 py-3 align-top text-body">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function HowItWorksPage() {
  const { claims, onboarding } = page;

  return (
    <div className="pb-28 pt-16 md:pb-40 md:pt-24">
      <Container>
        <div className="max-w-[720px]">
          <h1 className="text-balance text-[clamp(2.75rem,6vw,5rem)] font-semibold leading-[0.95] tracking-headline text-ink">
            {page.headline}
          </h1>
          <p className="mt-8 max-w-[36ch] text-pretty text-lg leading-relaxed text-body md:text-xl">{page.intro}</p>

          {/* Claims and disputes */}
          <section aria-labelledby={claims.id} className="mt-24 md:mt-32">
            <H2 id={claims.id}>{claims.headline}</H2>
            <p className="mt-6 text-lg leading-relaxed text-body md:text-xl">{claims.intro}</p>

            <H3>{claims.whatWeFile.headline}</H3>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-lg leading-relaxed text-body marker:text-muted-foreground">
              {claims.whatWeFile.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className={P}>{claims.whatWeFile.after}</p>

            <H3>{claims.howAClaimStarts.headline}</H3>
            <p className={P}>{claims.howAClaimStarts.text}</p>

            <H3>{claims.carrierTable.headline}</H3>
            <CarrierTable />
            <p className="mt-4 text-sm text-muted-foreground">{claims.carrierTable.note}</p>

            <H3>{claims.afterWeFile.headline}</H3>
            <p className={P}>{claims.afterWeFile.text}</p>
          </section>

          <hr className="my-24 border-line md:my-32" />

          {/* Onboarding */}
          <section aria-labelledby={onboarding.id}>
            <H2 id={onboarding.id}>{onboarding.headline}</H2>
            <p className="mt-6 text-lg leading-relaxed text-body md:text-xl">{onboarding.intro}</p>

            {onboarding.steps.map((step, i) => (
              <div key={step.title}>
                <H3>{`${i + 1}. ${step.title}`}</H3>
                <p className={P}>{step.text}</p>
              </div>
            ))}
          </section>

          {/* The page's only "Get in touch" button. */}
          <div className="mt-24 md:mt-32">
            <p className="max-w-[30ch] text-pretty text-xl leading-snug text-ink md:text-2xl">{page.closing}</p>
            <PillButton href={CONTACT_HREF} className="mt-8">
              {site.contactLabel}
            </PillButton>
          </div>
        </div>
      </Container>
    </div>
  );
}
