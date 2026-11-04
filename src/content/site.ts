/**
 * All site copy lives here. Edit words in this file, not in components.
 * Voice: confident, plain, understated. No exclamation points.
 */

export const site = {
  name: "Blend",
  email: "hello@blend.example",
  title: "Blend — We recover what commerce leaves behind.",
  description:
    "Money slips out of every supply chain. Blend finds it, and puts it back.",
  contactLabel: "Get in touch",
} as const;

export const hero = {
  headlineLead: "We recover what commerce",
  headlineAccent: "leaves behind.",
  // "We\u00a0claim\u00a0it." uses non-breaking spaces so the closing line never strands one word.
  subline:
    "Carriers owe your brands money on every lost and damaged package. Almost none of it gets claimed. We\u00a0claim\u00a0it.",
  secondaryCta: "See how it works",
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
  items: [
    { prefix: "", value: 40, suffix: "%+", line: "of eligible shipping refunds never get filed.", source: "EasyPost" },
    { prefix: "", value: 75, suffix: "%", line: "of parcel audit credits go unclaimed.", source: "ShipScience" },
    { prefix: "$", value: 3, suffix: "B+", line: "in carrier credits goes unclaimed every year.", source: "Intelligent Audit" },
    {
      prefix: "",
      value: 60,
      suffix: " days",
      line: "is how long most damage claims stay open. Then the money is gone.",
      source: "UPS and FedEx claim terms",
    },
  ],
} as const;

export const howItWorks = {
  headline: "How it works.",
  steps: [
    {
      number: "01",
      title: "Find",
      body: "We surface every lost and damaged shipment across your brands, on UPS, FedEx, USPS, and regional carriers.",
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
    { title: "Effortless", body: "An hour of setup. Nothing to run." },
    { title: "Compounding", body: "Every claim we file makes the next one faster." },
  ],
  setupSteps: ["Carrier accounts connected", "Brands confirmed", "Nothing else to do"],
} as const;

export const vision = {
  statement: "Today, carrier claims for logistics.",
  followup: "Next, the rest of it.",
  note: "Lost and damaged shipments across every carrier you use, then retail deductions, then the rest of the back office.",
} as const;

export const footer = {
  tagline: "Nothing left on the table.",
} as const;
