import { ScrollTextReveal } from "@/components/motion/ScrollTextReveal";
import { belief } from "@/content/site";

/** The one deep section: words light up as you scroll; the last line lands in mint. */
export function Belief() {
  return (
    <section aria-labelledby="belief" className="grain bg-deep text-on-deep">
      <ScrollTextReveal
        id="belief"
        statement={belief.statement}
        followup={belief.followup}
        accent={belief.accent}
        className="relative z-[2]"
      />
    </section>
  );
}
