/**
 * Copy for /how-it-works. Edit words here, not in the page.
 * Carrier terms are dated: re-check them before changing `carrierTable.note`.
 */

export const howItWorksPage = {
  meta: {
    title: "How it works — Blend",
    description: "What Blend files, what carriers require, and how setup works.",
  },
  headline: "How it works",
  intro: "What we file, what carriers require, and how we get set up with you.",

  claims: {
    id: "claims",
    headline: "Claims",
    intro:
      "When a carrier loses or damages a package, the shipper is owed money. For a 3PL, that’s you, on behalf of the brand that owned the goods.",

    whatWeFile: {
      headline: "What we file",
      items: [
        "Lost packages. Tracking stops moving, or the carrier marks it lost.",
        "Damaged packages and missing contents.",
      ],
      after: "On every carrier you ship with: UPS, FedEx, USPS, DHL, OnTrac, and regionals.",
    },

    howAClaimStarts: {
      headline: "How a claim starts",
      text: "We watch every shipment’s tracking, so problems get flagged before anyone complains. Damage reports from brands and customers get forwarded to an inbox we set up, and we take it from there.",
    },

    /** Rules table: UPS and FedEx only (the carriers with published terms), not a list of what we cover. */
    carrierTable: {
      headline: "What carriers require",
      /** Screen-reader name for the blank first column header. */
      rowHeader: "Requirement",
      carriers: ["UPS", "FedEx"],
      rows: [
        { label: "Report damage", values: ["Within 60 days of delivery", "Within 60 days of delivery"] },
        { label: "Report a lost package", values: ["Within 9 months", "Within 9 months"] },
        {
          label: "Default liability",
          values: ["$100 per package unless more was declared", "$100 per package unless more was declared"],
        },
        { label: "Photos for damage", values: ["3: outer box, packaging, item", "Box, packaging, item"] },
        { label: "How you’re paid", values: ["Electronic transfer to your bank", "Check or account credit"] },
      ],
      note: "Carrier terms as of November 2026. We check each one before filing.",
    },

    afterWeFile: {
      headline: "After we file",
      text: "The carrier reviews it, usually within a few weeks. If they approve, the money goes straight to your account; it never passes through Blend. If the carrier asks for more information or a missing document, we send it. You owe nothing on claims the carrier denies.",
    },
  },

  onboarding: {
    id: "onboarding",
    headline: "Onboarding",
    intro: "About an hour of your time. Nothing to install. First claims are filed within a week of the intro call.",
    /** Rendered as H3s with a plain number: "1. Intro call". */
    steps: [
      {
        title: "Intro call",
        text: "30 minutes. Your carriers, your volume, how many brands you ship for, and how damage reports reach you today.",
      },
      {
        title: "Agreement",
        text: "One page. What we file, how we’re paid, and that you can end it any time. Nothing is owed on claims carriers deny.",
      },
      {
        title: "Carrier access",
        text: "You add Blend as a user on your carrier accounts. Where the carrier allows it, our user can file claims and nothing else. It can’t ship, can’t see billing, and you can remove it in one click.",
      },
      {
        title: "Shipment data and reports",
        text: "A daily export from your shipping software, and damage reports forwarded to an inbox we set up. Nothing else changes about how your team works.",
      },
      {
        title: "Lookback",
        text: "We go through every shipment still inside its claim window. Lost packages can be claimed months back (up to 9 on UPS and FedEx), so there’s usually money waiting before we’ve filed a single new claim.",
      },
      {
        title: "Monthly statement",
        text: "One statement, broken out by brand: each claim, its status, and what was paid. You credit each brand what was recovered for them.",
      },
    ],
  },

  closing: "Questions? Ask us. We’ll walk through it with your numbers.",
} as const;
