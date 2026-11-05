import { BeamDiagram } from "./BeamDiagram";

/** Hero visual: the beam diagram straight on the page, with only a faint glow behind it. */
export function HeroBeam() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[125%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-(image:--glow-hero)"
      />
      <BeamDiagram size="hero" className="py-6 sm:px-6 sm:py-10 lg:px-0" />
    </div>
  );
}
