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
  /** Hero card stack: each problem drops in, then flips to `claimedLabel` (detail line stays). */
  claimedLabel: "Claimed ✓",
  claims: [
    { title: "Damaged in transit", detail: "Candle order · arrived broken" },
    { title: "Lost package", detail: "No scan for 12 days" },
    { title: "Missing item", detail: "1 of 3 in the box" },
    { title: "Crushed box", detail: "Supplement order · leaking" },
    { title: "Never delivered", detail: "Marked delivered, never arrived" },
  ],
} as const;

/** Hero + How it works diagram: signals → Blend → your brands. Icons only, no carrier names. */
export const beam = {
  /** Order matches the icons in BeamDiagram: PackageX, Package, Mail, ScanBarcode, Truck. */
  signals: ["Damaged shipment", "Lost package", "Customer complaint", "Tracking exception", "Carrier"],
  centerLabel: "Blend",
  moneyCaption: "Back to your brands",
  label:
    "Diagram: damaged shipments, lost packages, customer complaints, tracking exceptions, and carrier records flow into Blend, and the money goes back to your brands.",
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

/** Between the facts and How it works: why the money goes unclaimed. */
export const whyUnclaimed = {
  headline: "Why it never gets claimed.",
  reasons: [
    {
      title: "Nobody owns it.",
      body: "Claims aren’t anyone’s job. They land on whoever’s free, usually after a brand complains.",
    },
    {
      title: "It takes too long.",
      body: "Every claim needs tracking, item cost, photos, and the right carrier form. Each one eats close to an hour.",
    },
    {
      title: "Nobody’s keeping score.",
      body: "Brands rarely know what they’re owed. Lost packages nobody complains about never get looked at, and the deadlines quietly pass.",
    },
  ],
  closing: "So the money stays with the carrier.",
} as const;

export const howItWorks = {
  headline: "How it works.",
  /** Title of each step's task-feed card, and the item that lands on top at the end. */
  diyLabel: "Doing it yourself",
  diyDone: "Blend does this.",
  /** Large line after the three steps. */
  closing: "At 80,000 parcels a month, that’s hundreds of claims, and a full-time job nobody at your 3PL has.",
  /** `diy`: the manual work behind each step. `when` is the small muted label on the right. */
  steps: [
    {
      number: "01",
      title: "Find",
      body: "We surface every lost and damaged shipment across every brand in your warehouse, on UPS, FedEx, USPS, and regional carriers.",
      diy: [
        { task: "Check tracking on every parcel", when: "every day" },
        { task: "Spot the ones that stopped moving", when: "every day" },
        { task: "Dig damage reports out of brand emails", when: "again" },
        { task: "Track every deadline", when: "always" },
      ],
    },
    {
      number: "02",
      title: "File",
      body: "We recover them under your accounts, built to each carrier’s exact requirements, inside every deadline.",
      diy: [
        { task: "Pull the tracking history", when: "per claim" },
        { task: "Get the item’s cost from the brand", when: "waiting" },
        { task: "Chase the customer for three photos", when: "again" },
        { task: "Fill the UPS form", when: "per claim" },
        { task: "Fill the FedEx form", when: "another form" },
        { task: "Repeat for the next package", when: "again" },
      ],
    },
    {
      number: "03",
      title: "Return",
      body: "The money lands back where it belongs. You get a clean statement every month.",
      diy: [
        { task: "Wait weeks for the carrier", when: "weeks" },
        { task: "Answer their follow-up", when: "again" },
        { task: "Find the payment", when: "later" },
        { task: "Match it to the claim", when: "by hand" },
        { task: "Credit the right brand", when: "by hand" },
      ],
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
    {
      title: "Nothing added to your team.",
      body: "No new hire, no new software. We do the filing. You forward what we ask for.",
    },
    {
      title: "A reason your brands stay.",
      body: "Every month, you send your brands money back. That’s a conversation every 3PL wants to have.",
    },
  ],
  /** Large line at the bottom of the third card. */
  brandsLine: "+ $ back to your brands",
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
