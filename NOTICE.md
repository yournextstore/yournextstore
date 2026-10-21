# Notice

This storefront theme is a derivative of **3D-Ecommerce-Landing-Page-Nextjs-GSAP** by AliGates915
(https://github.com/AliGates915/3D-Ecommerce-Landing-Page-Nextjs-GSAP), the final code of the
"Fizzi" 3D landing-page course, licensed under the Apache License, Version 2.0 (full text below).

What was taken from the original: its visual design. The sunshine-yellow page with lime, sky and
flavour-coloured panels, the heavy two-line orange hero headline over a navy subhead and the
chunky orange button, the floating products either side of the hero, the "try all the flavours"
panel, the sky-dive panel with its headline scattered round a falling product, the flavour carousel
with its two counter-rotating wavy blobs and arrow buttons, the alternating text-and-product
sections, the giant lemon-on-tangerine type band, the lemon footer with its spinning text roundel,
and the original's colour values and type scale.

Changes made (Apache-2.0 §4(b)):

- Rebuilt on the Your Next Store storefront (Next.js App Router, Commerce Kit). Store name,
  products, categories and collections come from the store's API; nothing is hardcoded.
- The react-three-fiber/GSAP scenes (3D cans, instanced bubbles, sky-dive clouds, scroll-scrubbed
  timelines) are replaced by a static rendering of the same effect in CSS: catalogue photos
  multiplied onto the coloured panels, a slow bob animation, CSS bubbles and cloud gradients, and
  CSS-rotated SVG blobs. No WebGL, GSAP or 3D asset is shipped.
- No brand name, logo, can label artwork, HDR maps or 3D model from the original is included. The
  Alpino typeface (Fontshare, not covered by the repository licence) is replaced by League Spartan
  from Google Fonts. All copy is rewritten.
- The landing page's language is extended to pages the original does not have: product listing,
  category and collection pages, the product page, the cart drawer, the mobile menu and an about page.
- Orange tones are darkened slightly where text sits on them, to meet WCAG AA contrast.

<!-- store-pipeline:generated -->
## Generated photographs

These files were generated for this template's store with an image model (bfl/flux-2-klein-9b through the Vercel AI Gateway).
They show no real products, people or brands and carry no third-party licence:

- `public/images/pexels/pastel-bags.jpg`
- `public/images/pexels/summer-hat.jpg`
- `public/images/pexels/pink-sunglasses.jpg`
<!-- /store-pipeline:generated -->
