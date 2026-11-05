/**
 * All site copy lives here. Edit words in this file, not in components.
 * Voice: confident, plain, understated. No exclamation points.
 */

export const site = {
  name: "Blend",
  // The contact address lives in src/lib/site.ts (CONTACT_EMAIL).
  title: "Blend — We recover what commerce leaves behind.",
  description:
    "Money slips out of every supply chain. Blend finds it, and puts it back.",
  /** Link previews (Open Graph / Twitter) for the home page. */
  preview: {
    title: "Blend",
    description: "Blend recovers the money commerce leaves behind. Carrier claims for 3PLs.",
  },
  contactLabel: "Get in touch",
} as const;

/** Page links in the nav (all pages). The footer adds its own (see `footer.links`). */
export const nav = {
  links: [{ label: "How it works", href: "/how-it-works" }],
} as const;

export const hero = {
  headlineLead: "We recover what commerce",
  headlineAccent: "leaves behind.",
  // "We\u00a0claim\u00a0it\u00a0for\u00a0you." uses non-breaking spaces so the closing line never strands one word.
  subline:
    "Carriers owe the brands you ship for money on every lost and damaged package. Almost none of it gets claimed. We\u00a0claim\u00a0it\u00a0for\u00a0you.",
  secondaryCta: "See how it works",
  /** Small muted lines under the hero buttons, in this order. */
  pricing: "First month free. After that, 25% of what we recover. Nothing if nothing is.",
  audience: "Built for 3PLs and the brands they ship for.",
} as const;

/** Hero + How it works diagram: signals → Blend → your brands. Icons only, no carrier names. */
export const beam = {
  /** Order matches the icons in BeamDiagram: PackageX, Package, Mail, ScanBarcode, Truck. */
  signals: ["Damaged shipment", "Lost package", "Customer complaint", "Tracking exception", "Carrier"],
  centerLabel: "Blend",
  moneyCaption: "Back to your brands",
  label:
    "Diagram: damaged shipments, lost packages, customer complaints, tracking exceptions, and carrier records flow into Blend, and the money goes back to your brands.",
  stepLabels: [
    "Diagram: a damaged shipment is found.",
    "Diagram: the damaged-shipment claim travels into Blend, which files it with the carrier.",
    "Diagram: the recovered money travels from Blend back to your brands.",
  ],
} as const;

export const belief = {
  statement: "Every day, money leaks out of commerce.",
  followup: "It’s treated as the cost of doing business.",
  accent: "We don’t think it should be.",
} as const;

/** Industry figures, not Blend results. Verify sources before publishing. */
export const facts = {
  headline: "The money is already there.",
  footnote: "Industry figures. Not Blend results.",
  // Checked against each source page on 2026-11-03. Only figures that match their source
  // exactly are kept; re-check the link before adding or changing one.
  items: [
    {
      prefix: "",
      value: 75,
      suffix: "%",
      line: "of parcel audit credits go unclaimed.",
      source: "ShipScience",
      // "75% of parcel audit credits owed by UPS and FedEx go unclaimed every year." (Mar 16, 2026)
      url: "https://www.shipscience.com/your-claims-process-isn-t-working-you-just-don-t-know-it-yet/",
    },
    {
      prefix: "$",
      value: 3,
      suffix: "B+",
      line: "in carrier credits goes unclaimed every year.",
      source: "Intelligent Audit",
      // Headline: "The $3B+ Blind Spot…"; body: "Every year, an estimated $3 billion in shipping refunds go unclaimed" (Jun 17, 2025)
      url: "https://www.intelligentaudit.com/blog/miss-out-on-parcel-refunds",
    },
  ],
} as const;

export const howItWorks = {
  headline: "How it works.",
  steps: [
    {
      number: "01",
      title: "Find",
      body: "We surface every lost and damaged shipment across every brand in your warehouse, on UPS, FedEx, USPS, and regional carriers.",
      before: "Damage reports scattered across inboxes, portals, and spreadsheets.",
    },
    {
      number: "02",
      title: "File",
      body: "We recover them under your accounts, built to each carrier’s exact requirements, inside every deadline.",
      before: "Claims filed late, missing a document, or never filed at all.",
    },
    {
      number: "03",
      title: "Return",
      body: "The money lands back where it belongs. You get a clean statement every month.",
      before: "Credits that show up with no way to match them to a shipment.",
    },
  ],
} as const;

export const banner = {
  lines: ["Lost money doesn’t vanish.", "It waits to be claimed."],
} as const;

export const outcomes = {
  headline: "What changes.",
  cards: [
    { title: "Recovered", body: "Money you were owed, back in your account." },
    { title: "Effortless", body: "An hour of setup. We do the filing." },
    { title: "Compounding", body: "Every claim we file makes the next one faster." },
  ],
  setupSteps: ["Carrier accounts connected", "Brands confirmed", "Nothing else to do"],
} as const;

export const vision = {
  statement: "Today, carrier claims for 3PLs.",
  followup: "Next, the rest of it.",
  note: "Lost and damaged shipments across every carrier you use, then retail deductions, then the rest of the back office.",
} as const;

/** Scroll-expanding video between How it works and the banner. */
export const expandVideo = {
  line: "Every package leaves a paper trail.",
} as const;

/** "Questions", above the footer's closing line. */
export const faq = {
  headline: "Questions",
  items: [
    {
      q: "Do you need our carrier login?",
      a: "No. You add us as our own user on your carrier accounts. Where the carrier allows it, that user can only file claims, and you can remove it any time.",
    },
    { q: "Which carriers do you handle?", a: "Every carrier you ship with: UPS, FedEx, USPS, and regionals." },
    { q: "What does it cost?", a: "First month free. After that, 25% of what we recover. Nothing if nothing is." },
    { q: "How do our brands get the money?", a: "Carriers pay you directly. You credit each brand on your monthly statement." },
    {
      q: "What if a claim is denied?",
      a: "You owe nothing. If it was denied for a missing document, we send it and resubmit.",
    },
    { q: "How long does setup take?", a: "About an hour of your time. First claims are filed within a week." },
  ],
} as const;

/** Landing page, above the footer. Placeholders until the real names and links are in. */
export const team = {
  headline: "Who we are",
  people: [
    { name: "[NAME 1]", line: "[ONE LINE]", linkedin: "[LINKEDIN URL]" },
    { name: "[NAME 2]", line: "[ONE LINE]", linkedin: "[LINKEDIN URL]" },
  ],
  linkLabel: "LinkedIn",
} as const;

export const footer = {
  /** Closing line. Each entry is one line on mobile; it runs together from sm up. */
  tagline: ["Nothing", "left on", "the table."],
  links: [...nav.links, { label: "Privacy", href: "/privacy" }],
} as const;
