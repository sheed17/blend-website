Swap in the final Blend logo (two-tone tiles). Files are in the blend-logo folder I added to the repo root.

1. Replace the current mark in components/Logo (LogoMark) with this inline SVG (viewBox 0 0 48 48, keep it inline so it stays crisp):
   <rect x="6" y="8" width="24" height="24" rx="7" fill="#147A4B"/>
   <rect x="18" y="16" width="24" height="24" rx="7" fill="#3DCB7F"/>
   <path d="M18 23a7 7 0 0 1 7-7h5v9a7 7 0 0 1-7 7h-5z" fill="#8EE4B6"/>
   Add a `mono` prop that renders both rects in currentColor (second rect at 50% opacity, no overlap path) for footer/one-color use.
2. Logo lockup = LogoMark + "blend" in Geist Sans 700, lowercase, letter-spacing -0.045em. Mark height = cap height of the wordmark x ~1.25, gap ~0.22x the mark size. Use it in the nav and the footer. Delete any old logo SVGs/components.
3. Favicons: copy blend-logo/favicon.ico and blend-logo/svg/favicon.svg into app/ (as favicon.ico and icon.svg), and blend-logo/png/apple-touch-icon.png into app/apple-icon.png. Remove the default Next.js favicon.
4. Replace the "$" beam node and any other place the old mark appears so nothing references the old logo.
5. Check: nav at desktop and 375px wide, footer, light/dark if we have it, browser tab icon. Don't change anything else.
