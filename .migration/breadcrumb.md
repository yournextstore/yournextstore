# breadcrumb

2026-10-18 (second pass). Strategy: golden pair via CLI. components.json moved from the legacy `new-york` style to `base-maia`, and the wrapper was reinstalled with `shadcn add <component> --overwrite` (shadcn 4.22.0). The CLI leaves the registry's bare `import { cn } from "cn"` and installs an unrelated `cn` npm package to satisfy it, so after each add the import was rewritten to `@/lib/utils` and the package removed. The stock base styles also need `@import "shadcn/tailwind.css"` (custom variants such as `data-horizontal`, plus accordion keyframes), now in `app/globals.css` with `shadcn` as a dev dependency. Verdict: stock base-maia file, no local diff.

## Changed

- `components/ui/breadcrumb.tsx`: registry file. It has no `"use client"`. The first pass added one on the assumption that `useRender` could not run on the server; under `next start` the product, category and collection pages render their breadcrumb links server-side without errors, so the stock file is used as is.
- Call sites keep `render={<Link />}` from the first pass.

Leftover scan: `grep -n "radix-ui\|@radix-ui\|IconPlaceholder\|from \"cn\""` on this file is clean.

## Left alone

None.

## Behavior changes

None.

## Verify by hand

- Product, category, collection and blog-post pages: breadcrumb links soft-navigate.
