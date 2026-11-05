/**
 * THE theme switch. Sets <html data-theme>, which selects a palette block in
 * src/app/theme.css: "green" (the live palette) or "kinetic" (orange).
 */
export const ACTIVE_THEME: ThemeName = "green";

/**
 * Per-theme values that can't come from CSS: the browser-chrome color
 * (<meta name="theme-color">). Everything else lives in theme.css.
 */
export const THEMES = {
  green: { themeColor: "#FAFAF7" },
  kinetic: { themeColor: "#FCFFFF" },
} as const;

export type ThemeName = keyof typeof THEMES;
