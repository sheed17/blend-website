"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/primitives/Container";
import { PillButton } from "@/components/primitives/PillButton";
import { nav, site } from "@/content/site";
import { CONTACT_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-text";

/** Active page link in ink, others muted. Underline on hover, 150ms color fade. */
function linkClass(active: boolean) {
  return cn(
    "rounded-sm font-medium underline-offset-4 transition-colors duration-150 hover:underline",
    active ? "text-ink" : "text-muted-foreground hover:text-ink",
    FOCUS,
  );
}

/**
 * Sticky top bar on every page, 64px tall. Transparent at the top of the page; after
 * 8px of scroll it gets the page background at 80%, a backdrop blur, and a 1px bottom
 * border. Below md the links move into a full-width panel under the bar, opened by a
 * menu button and closed by a link click or Escape.
 */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the panel and puts focus back on the menu button.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const close = () => setOpen(false);
  // Any link in the panel (page links and the mailto button) closes it.
  const closeOnLink = (e: MouseEvent<HTMLElement>) => {
    if ((e.target as HTMLElement).closest("a")) close();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-150",
        open
          ? "border-line bg-background"
          : scrolled
            ? "border-line bg-background/80 backdrop-blur-md"
            : "border-transparent bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" aria-label="Blend, home" onClick={close} className={cn("rounded-sm text-[1.45rem] text-ink", FOCUS)}>
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {nav.links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn("text-sm", linkClass(active))}
              >
                {link.label}
              </Link>
            );
          })}
          <PillButton href={CONTACT_HREF} size="sm">
            {site.contactLabel}
          </PillButton>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
          className={cn("-mr-2 inline-flex size-10 items-center justify-center rounded-md text-ink md:hidden", FOCUS)}
        >
          {open ? (
            <X aria-hidden="true" className="size-6" strokeWidth={1.75} />
          ) : (
            <Menu aria-hidden="true" className="size-6" strokeWidth={1.75} />
          )}
        </button>
      </Container>

      {/* Mobile panel: full width, directly under the bar. */}
      <div id={panelId} hidden={!open} className="absolute inset-x-0 top-full border-b border-line bg-background md:hidden">
        <Container>
          <nav aria-label="Main" onClick={closeOnLink} className="flex flex-col items-start gap-6 py-6">
            {nav.links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn("text-lg", linkClass(active))}
                >
                  {link.label}
                </Link>
              );
            })}
            <PillButton href={CONTACT_HREF}>{site.contactLabel}</PillButton>
          </nav>
        </Container>
      </div>
    </header>
  );
}
