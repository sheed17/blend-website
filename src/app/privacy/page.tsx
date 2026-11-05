import type { Metadata } from "next";
import { Container } from "@/components/primitives/Container";
import { privacyPage as page } from "@/content/privacy";
import { CONTACT_EMAIL, CONTACT_HREF, socialMetadata } from "@/lib/site";

export const metadata: Metadata = {
  title: page.meta.title,
  description: page.meta.description,
  ...socialMetadata(page.meta.title, page.meta.description),
};

const P = "mt-6 text-lg leading-relaxed text-body";
const LEAD = "font-medium text-ink";

/** Same layout as /how-it-works: one left-aligned text column, max 720px. */
export default function PrivacyPage() {
  return (
    <div className="pb-28 pt-16 md:pb-40 md:pt-24">
      <Container>
        <div className="max-w-[720px]">
          <h1 className="text-balance text-[clamp(2.75rem,6vw,5rem)] font-semibold leading-[0.95] tracking-headline text-ink">
            {page.headline}
          </h1>

          <div className="mt-12 md:mt-16">
            {page.items.map((item) => (
              <p key={item.lead} className={P}>
                <span className={LEAD}>{item.lead}</span> {item.text}
              </p>
            ))}
            <p className={P}>
              <span className={LEAD}>{page.questionsLead}</span>{" "}
              <a
                href={CONTACT_HREF}
                className="text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>

          <p className="mt-16 text-sm text-muted-foreground">{page.updated}</p>
        </div>
      </Container>
    </div>
  );
}
