import localFont from "next/font/local";

/**
 * THE font switch. Sets <html data-font>, which picks the sans family (headings
 * and body) and its headline tracking in src/app/globals.css. Mono text always
 * uses Geist Mono. Set to "geist" to restore the original look.
 */
export const ACTIVE_FONT: FontName = "switzer";

export type FontName = "switzer" | "geist";

/**
 * Switzer by Indian Type Foundry, from Fontshare. Self-hosted under the ITF Free
 * Font License (public/fonts/switzer/FFL.txt). Don't modify, subset or convert
 * the files: the license treats that as a derivative work.
 */
export const switzer = localFont({
  src: [
    { path: "../../public/fonts/switzer/Switzer-Variable.woff2", weight: "100 900", style: "normal" },
    { path: "../../public/fonts/switzer/Switzer-VariableItalic.woff2", weight: "100 900", style: "italic" },
  ],
  variable: "--font-switzer",
  display: "swap",
});
