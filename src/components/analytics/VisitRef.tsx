"use client";

import { track } from "@vercel/analytics";
import { useEffect } from "react";

// Once per page load (React re-runs effects in development's Strict Mode).
let sent = false;

/**
 * Outbound attribution: on page load, sends `?r=<ref>` as a "visit" custom event so a
 * visit can be tied to the email that linked it. The URL is left untouched.
 */
export function VisitRef() {
  useEffect(() => {
    const ref = new URLSearchParams(window.location.search).get("r");
    if (!ref || sent) return;
    sent = true;
    // The same queue stub Vercel's own snippet installs: holds calls until the analytics
    // script loads, so this event isn't dropped if it fires before <Analytics /> injects.
    window.va ??= (event, properties) => {
      (window.vaq ??= []).push([event, properties]);
    };
    track("visit", { ref: ref.slice(0, 255) });
  }, []);

  return null;
}
