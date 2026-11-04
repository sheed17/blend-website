"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/primitives/Container";
import { PillButton } from "@/components/primitives/PillButton";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/** Solid white bar on every section, so it never muddies over the dark Belief section. */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b bg-white transition-colors duration-300",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between md:h-[72px]">
        <Link
          href="/"
          aria-label="Blend, home"
          className="rounded-sm text-[1.45rem] text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-text"
        >
          <Logo />
        </Link>
        <PillButton href={`mailto:${site.email}`} size="sm">
          {site.contactLabel}
        </PillButton>
      </Container>
    </header>
  );
}
