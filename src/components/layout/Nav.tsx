"use client";

import { CircleHelp, Tag, Workflow, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { Container } from "@/components/primitives/Container";
import { PillButton } from "@/components/primitives/PillButton";
import { nav, site } from "@/content/site";
import { goToFaq, type FaqTarget } from "@/lib/faq-nav";
import { CONTACT_HREF } from "@/lib/site";
import { cn } from "@/lib/utils";

type LinkId = (typeof nav.links)[number]["id"];

const FOCUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

/** Phone icons for the pill (text from sm up). */
const ICONS: Record<LinkId, LucideIcon> = { how: Workflow, pricing: Tag, faq: CircleHelp };

/**
 * Frosted glass in the cards' bezel: outer frame + inner pill with the gradient border,
 * page background at 75% and a backdrop blur. `off` keeps the size but drops the glass.
 */
function Glass({ children, off = false, className, innerClassName }: {
  children: ReactNode;
  off?: boolean;
  className?: string;
  innerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "bezel [--bezel-bg:color-mix(in_srgb,var(--bg)_75%,transparent)] [--bezel-r:9999px]",
        off ? "border-transparent bg-transparent" : "backdrop-blur-md",
        className,
      )}
    >
      <div className={cn("bezel-card flex items-center", off && "border-transparent bg-none shadow-none", innerClassName)}>
        {children}
      </div>
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
 * Sticky top bar, 64px tall, with three floating pieces: logo (left), a frosted
 * tubelight pill of links (center, 12px from the top) and "Get in touch" (right).
 *
 * Lit link: hover wins; otherwise "How it works" on /how-it-works, and on the home page
 * "FAQ" while the Questions section is in view ("Pricing" if that's how you got there).
 * Pricing and FAQ scroll on the home page and land there from other pages.
 *
 * The logo gets its own glass chip once the page scrolls, so it stays legible over the
 * dark sections. Phones: icons in the pill, compact button; nothing wraps at 390px.
 */
export function Nav() {
  const pathname = usePathname();
  const home = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [inFaq, setInFaq] = useState(false);
  const [faqTab, setFaqTab] = useState<FaqTarget>("faq");
  const [hover, setHover] = useState<LinkId | null>(null);

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

  return (
    <header
      data-surface={overHero ? "nav-hero" : undefined}
      className={cn("sticky top-0 z-50 h-16", overHero && "bg-hero")}
    >
      <Container className="grid h-full grid-cols-[1fr_auto_1fr] items-center gap-2 pt-3">
        <Glass off={!scrolled} className="-ml-3 justify-self-start sm:-ml-3.5" innerClassName="h-[42px] px-1.5 sm:px-2">
          <Link href="/" aria-label="Blend, home" className={cn("rounded-full text-xl text-ink sm:text-[1.45rem]", FOCUS)}>
            <Logo />
          </Link>
        </Glass>

        <nav aria-label="Main" onMouseLeave={() => setHover(null)}>
          <Glass innerClassName="gap-0.5 p-1">
            {nav.links.map((link) => {
              const Icon = ICONS[link.id];
              const target = "target" in link ? link.target : null;
              const isActive = active === link.id;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  aria-current={isActive ? (target ? "location" : "page") : undefined}
                  onMouseEnter={() => setHover(link.id)}
                  onFocus={() => setHover(link.id)}
                  onBlur={() => setHover(null)}
                  onClick={(e) => {
                    if (!target) return;
                    setFaqTab(target);
                    if (!home) return; // Next navigates to /#…; the FAQ picks the hash up.
                    e.preventDefault();
                    window.history.replaceState(null, "", `#${target}`);
                    goToFaq(target);
                  }}
                  className={cn(
                    "relative rounded-full px-2.5 py-2 text-sm font-medium transition-colors duration-150 sm:px-4 sm:py-1.5",
                    lit === link.id ? "text-ink" : "text-ink/65 hover:text-ink",
                    FOCUS,
                  )}
                >
                  {lit === link.id && <Lamp />}
                  <Icon aria-hidden="true" strokeWidth={1.9} className="relative size-[18px] sm:hidden" />
                  <span className="relative max-sm:sr-only">{link.label}</span>
                </Link>
              );
            })}
          </Glass>
        </nav>

        <PillButton
          href={CONTACT_HREF}
          size="sm"
          className="justify-self-end whitespace-nowrap max-sm:gap-0 max-sm:pl-3.5 max-sm:pr-3.5 max-sm:text-[13px] max-sm:[&>svg]:hidden"
        >
          {site.contactLabel}
        </PillButton>
      </Container>
    </header>
  );
}
