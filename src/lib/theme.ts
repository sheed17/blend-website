/**
 * THE theme switch. Sets <html data-theme>, which selects a palette block in
 * src/app/theme.css. Set to "green" to restore the original look.
 */
export const ACTIVE_THEME: ThemeName = "kinetic";

/**
 * Per-theme values that can't come from CSS: the browser-chrome color
 * (<meta name="theme-color">). Everything else lives in theme.css.
 */
export const THEMES = {
  green: { themeColor: "#FFFFFF" },
  kinetic: { themeColor: "#FCFFFF" },
} as const;

export type ThemeName = keyof typeof THEMES;
