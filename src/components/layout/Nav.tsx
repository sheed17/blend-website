"use client";

import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/primitives/Container";
import { PillButton } from "@/components/primitives/PillButton";
import { nav, site } from "@/content/site";
import { goToFaq, type FaqTarget } from "@/lib/faq-nav";
import { CONTACT_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

type NavLink = (typeof nav.links)[number];
type LinkId = NavLink["id"];

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

/**
 * Frosted glass in the cards' bezel: outer frame + inner card with the gradient border,
 * page background at 75% and a backdrop blur. Pill by default; pass --bezel-r to change.
 */
function Glass({ children, className, innerClassName }: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "bezel backdrop-blur-md [--bezel-bg:color-mix(in_srgb,var(--bg)_75%,transparent)] [--bezel-r:9999px]",
        className,
      )}
    >
      <div className={cn("bezel-card flex items-center", innerClassName)}>{children}</div>
    </div>
  );
}

/**
 * The tubelight: a soft pill behind the lit link with a glowing bar on its top edge,
 * shared by layoutId so it slides between links.
 */
function Lamp() {
  return (
    <motion.span
      layoutId="nav-lamp"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="absolute inset-0 rounded-full bg-mint/25"
    >
      <span className="absolute -top-[7px] left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-brand">
        <span className="absolute -left-2 -top-2 h-6 w-12 rounded-full bg-mint/50 blur-md" />
        <span className="absolute -top-1 h-6 w-8 rounded-full bg-brand/30 blur-md" />
        <span className="absolute left-2 top-0 size-4 rounded-full bg-mint/50 blur-sm" />
      </span>
    </motion.span>
  );
}

/**
 * Sticky top bar, 64px tall. Logo (left, plain), a frosted tubelight pill of links
 * (center, 12px from the top) and "Get in touch" (right).
 *
 * Lit link: hover wins; otherwise "How it works" on /how-it-works, and on the home page
 * "FAQ" while the Questions section is in view ("Pricing" if that's how you got there).
 * Pricing and FAQ scroll on the home page and land there from other pages.
 *
 * Phones (<640px): logo and a pill holding one menu button, which opens a frosted panel
 * with the links as text and "Get in touch".
 */
export function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [inFaq, setInFaq] = useState(false);
  const [faqTab, setFaqTab] = useState<FaqTarget>("faq");
  const [hover, setHover] = useState<LinkId | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Home page: is Questions in the middle band of the viewport?
  useEffect(() => {
    if (!home) return;
    const el = document.getElementById("faq");
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInFaq(entry.isIntersecting);
        if (!entry.isIntersecting) setFaqTab("faq");
      },
      { rootMargin: "-40% 0px -40% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      setInFaq(false);
    };
  }, [home]);

  // Menu: closes on a new page, Escape (focus back to the button), a tap outside the
  // bar, or the window growing past the phone layout.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      menuButton.current?.focus();
    };
    const onPointer = (e: PointerEvent) => {
      if (!header.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const wide = window.matchMedia("(min-width: 640px)");
    const onWide = () => wide.matches && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      wide.removeEventListener("change", onWide);
    };
  }, [menuOpen]);

  const active: LinkId | null = home
    ? inFaq
      ? faqTab
      : null
    : pathname.startsWith("/how-it-works")
      ? "how"
      : null;
  const lit = hover ?? active;

  // At the top of the home page the bar sits on the hero, so it takes the hero's
  // surface (transparent in green, orange in kinetic; see [data-surface] in theme.css).
  const overHero = home && !scrolled;

  const linkProps = (link: NavLink) => {
    const target = "target" in link ? link.target : null;
    const isActive = active === link.id;
    return {
      href: link.href,
      "aria-current": isActive ? (target ? ("location" as const) : ("page" as const)) : undefined,
      onClick: (e: MouseEvent<HTMLAnchorElement>) => {
        setMenuOpen(false);
        if (!target) return;
        setFaqTab(target);
        if (!home) return; // Next navigates to /#…; the FAQ picks the hash up.
        e.preventDefault();
        window.history.replaceState(null, "", `#${target}`);
        goToFaq(target);
      },
    };
  };

  return (
    <header
      ref={header}
      data-surface={overHero ? "nav-hero" : undefined}
      className={cn("sticky top-0 z-50 h-16", overHero && "bg-hero")}
    >
      <Container className="grid h-full grid-cols-[1fr_auto] items-center gap-2 pt-3 sm:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          aria-label="Blend, home"
          className={cn("justify-self-start rounded-full text-xl text-ink sm:text-[1.45rem]", FOCUS)}
        >
          <Logo />
        </Link>

        <nav aria-label="Main" onMouseLeave={() => setHover(null)} className="max-sm:hidden">
          <Glass innerClassName="gap-0.5 p-1">
            {nav.links.map((link) => (
              <Link
                key={link.id}
                {...linkProps(link)}
                onMouseEnter={() => setHover(link.id)}
                onFocus={() => setHover(link.id)}
                onBlur={() => setHover(null)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150",
                  lit === link.id ? "text-ink" : "text-ink/65 hover:text-ink",
                  FOCUS,
                )}
              >
                {lit === link.id && <Lamp />}
                <span className="relative">{link.label}</span>
              </Link>
            ))}
          </Glass>
        </nav>

        <PillButton href={CONTACT_HREF} size="sm" className="justify-self-end whitespace-nowrap max-sm:hidden">
          {site.contactLabel}
        </PillButton>

        <Glass className="justify-self-end sm:hidden" innerClassName="p-1">
          <button
            ref={menuButton}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
            className={cn("grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-mint/25", FOCUS)}
          >
            {menuOpen ? (
              <X aria-hidden="true" strokeWidth={1.9} className="size-5" />
            ) : (
              <Menu aria-hidden="true" strokeWidth={1.9} className="size-5" />
            )}
          </button>
        </Glass>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 420, damping: 34 }}
            className="absolute inset-x-4 top-full origin-top pt-2 sm:hidden"
          >
            <Glass
              className="bg-[color-mix(in_srgb,var(--ink)_3%,var(--bg))] [--bezel-bg:var(--bg)] [--bezel-r:1.25rem]"
              innerClassName="flex-col items-stretch p-2"
            >
              <nav id="mobile-menu" aria-label="Main" className="flex flex-col">
                {nav.links.map((link) => (
                  <Link
                    key={link.id}
                    {...linkProps(link)}
                    className={cn(
                      "rounded-xl px-3 py-3 text-lg font-medium transition-colors",
                      active === link.id ? "bg-mint/25 text-ink" : "text-ink/80 hover:bg-ink/5 hover:text-ink",
                      FOCUS,
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <PillButton href={CONTACT_HREF} className="mt-2 justify-center">
                {site.contactLabel}
              </PillButton>
            </Glass>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
