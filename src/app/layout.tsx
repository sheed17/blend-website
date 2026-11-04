import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { VisitRef } from "@/components/analytics/VisitRef";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { site } from "@/content/site";
import { SITE_URL, socialMetadata } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: site.title,
  description: site.description,
  ...socialMetadata(site.preview.title, site.preview.description),
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body>
        <MotionProvider>
          <Nav />
          <main>{children}</main>
          <Footer />
        </MotionProvider>
        <Analytics />
        <VisitRef />
      </body>
    </html>
  );
}
