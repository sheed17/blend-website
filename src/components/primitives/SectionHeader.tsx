import { Reveal } from "@/components/motion/Reveal";

/** Section headline (h2). No eyebrow label. */
export function SectionHeader({
  id,
  headline,
  className,
}: {
  id: string;
  headline: string;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <h2
        id={id}
        className="max-w-[18ch] text-balance text-[clamp(2.25rem,5vw,4.25rem)] font-semibold leading-[1] tracking-headline text-ink"
      >
        {headline}
      </h2>
    </Reveal>
  );
}
