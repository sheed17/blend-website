import type { Metadata } from "next";

/**
 * The one contact address. Every "Get in touch" button and mailto link uses it.
 * TODO: swap in the real address once the domain is live.
 */
export const CONTACT_EMAIL = "hello@[DOMAIN]";
export const CONTACT_HREF = `mailto:${CONTACT_EMAIL}`;

/**
 * Absolute base URL, needed so link-preview images resolve to a full URL.
 * Set NEXT_PUBLIC_SITE_URL once the domain is live; on Vercel it otherwise falls back
 * to the project's production domain, and locally to the dev server.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/** Link-preview image (public/og.png): the brand banner's tagline on ink, 1200×630. */
const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Blend recovers the money commerce leaves behind.",
};

/**
 * Open Graph + Twitter fields for a page. A page that sets its own `openGraph`
 * replaces the layout's entirely, so every page builds its preview from this.
 */
export function socialMetadata(title: string, description: string): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: { title, description, siteName: "Blend", type: "website", images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}
