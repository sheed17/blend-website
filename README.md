# Blend — website

Single-page brand site. Next.js (App Router, TypeScript), Tailwind CSS v4, Geist, Framer Motion.
Set up for shadcn / 21st.dev components.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm run lint
```

## Deploy to Vercel

Push to GitHub, then on vercel.com choose **Add New → Project**, import the repo, keep the defaults, and deploy.
Or from this folder: `npx vercel` (preview) / `npx vercel --prod`.

## Where to change things

| What | Where |
| --- | --- |
| All copy, contact email | `src/content/site.ts` |
| Brand colors, shadcn color mapping, grain | `src/app/globals.css` |
| Logo (single source) | `src/components/brand/LogoMark.tsx`. The nav, footer, both beam diagrams and the favicon (`src/app/icon.tsx`) all render it |
| Section order | `src/app/page.tsx` |
| Carrier → Blend → brands diagram (hero + How it works) | `src/components/visuals/BeamDiagram.tsx` |

## Adding 21st.dev components

Copy the install command from a component's page on 21st.dev, e.g.

```bash
npx shadcn@latest add "https://21st.dev/r/<author>/<component>"
```

It lands in `src/components/ui/`. Import it into a section in `src/components/sections/`.

- Colors: components that use `bg-background`, `text-foreground`, `text-muted-foreground`, `bg-primary`, `border-border` and so on already map to Blend (see `:root` in `globals.css`).
- Dark mode is class-based and never switched on, so `dark:` styles in pasted components stay dormant.
- Components using `motion/react` work. The `motion` package is installed alongside `framer-motion`.
- Hard-coded colors like `bg-zinc-900` or `text-blue-500` won't match the brand. Swap them for Blend tokens: `brand` (fills, with `text-ink`), `brand-text`, `brand-tint`, `ink`, `body`, `surface`, `line`, `muted-foreground`.

## Structure

```
src/
  app/          layout, page, globals.css, icon.tsx (favicon generated from LogoMark)
  content/      site copy
  lib/utils.ts  cn() helper (shadcn convention)
  components/
    brand/       LogoMark (the mark, single source), Logo (mark + wordmark)
    layout/      Nav, Footer (shared across future pages)
    sections/    Hero, Belief, HowItWorks, Banner, Outcomes, Vision
    visuals/     BeamDiagram, HeroBeam (built on Magic UI Animated Beam)
    motion/      Reveal, ScrollTextReveal, CountUp, MotionProvider
    primitives/  Container, PillButton, SectionHeader
    ui/          shadcn / Magic UI / 21st.dev installs (animated-beam.tsx has an added `animated` prop)
```

## Palette and contrast

Two-tone green. Bright `brand` is a fill only, always with ink on top. Green text uses `brand-text`.

| Token | Hex | Use |
| --- | --- | --- |
| `brand` | #3DCB7F | fills: buttons, badges, progress, chart bars, the hero marker. Ink text on top |
| `brand-hover` | #2FB56D | hover / pressed fill |
| `brand-text` | #147A4B | green text and focus rings on light backgrounds |
| `brand-tint` | #ECF9F2 | soft backgrounds, Found badge |
| `brand-deep` | #0C3B27 | the Belief section only |
| `mint` | #8EE4B6 | accents and chart bars on dark backgrounds |
| `ink` | #0B1410 | headlines, primary text, text on brand fills |
| `body` | #4A5550 | paragraph text |
| `muted-foreground` | #68726D | labels, captions, sources (the brief's "muted", darkened from #7C8781 to pass AA) |
| `line` | #E5E9E6 | borders, dividers |
| `surface` | #F6F8F6 | cards, alt sections |
| `paper` | #FFFFFF | page background |

Contrast ratios: ink on brand 8.96 · ink on brand-hover 7.09 · brand-text on white 5.36 · brand-text on brand-tint 4.95 · paper on brand-deep 12.57 · mint on brand-deep 8.33 · muted-foreground on white 4.98.
Never use white text on brand, or brand as text or a focus ring on white (2.09).

Type: Geist Sans everywhere. Geist Mono only for tracking numbers, step numbers, and figures.

With prefers-reduced-motion, the scroll reveal and count-ups render static, the beam diagrams show static paths, the marker appears without drawing in, and the drifting light is still.
