import { BackgroundVideo } from "@/components/media/BackgroundVideo";
import { ScrollTextReveal } from "@/components/motion/ScrollTextReveal";
import { belief } from "@/content/site";

/**
 * The one deep section: words light up as you scroll; the last line lands in mint.
 * Behind the text, a looping video under a deep-color overlay (--belief-overlay). The
 * video layer is pinned to the viewport for the length of the section, like the text.
 * Layers: video (z-0) → grain (z-1) → text (z-2).
 */
export function Belief() {
  return (
    <section aria-labelledby="belief" className="grain bg-deep text-on-deep">
      <div className="absolute inset-0 z-0">
        <div className="sticky top-0 h-svh max-h-full">
          <BackgroundVideo
            src="/media/belief.mp4"
            poster="/media/belief-poster.jpg"
            fallback="/media/belief-anim.webp"
            overlay="bg-(--belief-overlay)"
          />
        </div>
      </div>
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
