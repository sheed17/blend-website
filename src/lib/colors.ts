/**
 * Theme colors as CSS variable references, for places that take a color string
 * instead of a class: SVG stroke / stop-color (applied through `style`, since SVG
 * presentation attributes don't resolve var()). Values live in src/app/theme.css.
 */
export const colors = {
  /** Pulses and active paths in the beam diagram (re-scoped per surface). */
  beam: "var(--beam)",
  /** Quiet base paths in the beam diagram. */
  beamTrack: "var(--beam-track)",
  /** Accent lines on light backgrounds. */
  accentLine: "var(--accent-line)",
  ink: "var(--ink)",
} as const;
