/** Copy for /privacy. Edit words here, not in the page. Update `updated` with any change. */

export const privacyPage = {
  meta: {
    title: "Privacy — Blend",
    description: "What Blend receives, what we use it for, and what we don’t do with it.",
  },
  headline: "Privacy",
  items: [
    {
      lead: "What we receive:",
      text: "shipment records (tracking numbers, ship dates, carriers, order and SKU details), damage reports and photos you forward to us, and claims access on your carrier accounts.",
    },
    {
      lead: "What we use it for:",
      text: "filing and following up on carrier claims for you, and preparing your monthly statement. Nothing else.",
    },
    {
      lead: "What we don’t do:",
      text: "we don’t sell your data, share it with anyone outside Blend, or use it to contact your brands or customers.",
    },
    {
      lead: "Access:",
      text: "you can remove our user from your carrier accounts at any time. When you do, we stop. Claims already filed run until paid or closed. On request, we delete your shipment data within 30 days.",
    },
  ],
  /** Followed by the contact email (CONTACT_EMAIL). */
  questionsLead: "Questions:",
  updated: "Last updated November 2026.",
} as const;
