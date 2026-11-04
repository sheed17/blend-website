import type { CSSProperties } from "react";

/**
 * THE Blend mark: two overlapping rounded tiles. Single source for the nav and
 * footer (via Logo) and both beam diagrams' center node. Brand source files
 * (favicons, PNG exports) live in /brand.
 *
 * Full color by default. `mono` draws both tiles in currentColor (second tile at
 * 50% opacity, no overlap shape) for one-color spots; set the color with text-* classes.
 *
 * The tiles sit inside 6px (sides) / 8px (top & bottom) of padding in the 48×48 box,
 * so the visible mark is 36×32 units.
 */
type LogoMarkProps = {
  className?: string;
  /** Accessible name. Omit when decorative or labelled elsewhere. */
  title?: string;
  mono?: boolean;
  style?: CSSProperties;
};

export function LogoMark({ className, title, mono = false, style }: LogoMarkProps) {
  const labelled = Boolean(title);
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      style={style}
      role={labelled ? "img" : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      {labelled ? <title>{title}</title> : null}
      {mono ? (
        <>
          <rect x="6" y="8" width="24" height="24" rx="7" fill="currentColor" />
          <rect x="18" y="16" width="24" height="24" rx="7" fill="currentColor" opacity={0.5} />
        </>
      ) : (
        <>
          <rect x="6" y="8" width="24" height="24" rx="7" fill="#147A4B" />
          <rect x="18" y="16" width="24" height="24" rx="7" fill="#3DCB7F" />
          <path d="M18 23a7 7 0 0 1 7-7h5v9a7 7 0 0 1-7 7h-5z" fill="#8EE4B6" />
        </>
      )}
    </svg>
  );
}
