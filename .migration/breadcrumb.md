# breadcrumb

2026-10-18. Strategy: transformation engine on the project's own file. components.json style is the legacy `new-york`, which has no base counterpart, so the stock new-york-v4 radix file was used only to classify the wrapper (registry drift only: class order, unified `radix-ui` import, newer features; no user customizations) and the existing classes were kept. Verdict: migrated to `useRender` + `mergeProps`.

## Changed

- `components/ui/breadcrumb.tsx`: `BreadcrumbLink` swaps `Slot`/`asChild` for `useRender` (`render` prop, `state.slot` for `data-slot`). The module is now `"use client"` because `useRender` needs `useRef` and every consumer is a Server Component page; the `<Link>` passed through `render` serializes fine across the boundary.
- `app/product/[slug]/page.tsx`, `app/category/[...slugs]/page.tsx`, `app/collection/[slug]/page.tsx`, `app/blog/page.tsx`, `app/blog/[slug]/page.tsx`: `<BreadcrumbLink asChild><Link href=…>Text</Link></BreadcrumbLink>` → `<BreadcrumbLink render={<Link href=… />}>Text</BreadcrumbLink>`.

Leftover scan: `grep -n "radix-ui\|@radix-ui"` on the files below is clean.

## Left alone

- The non-link parts (`BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbPage`, …) are plain elements and were not touched.

## Behavior changes

None. The breadcrumb parts now ship as a (small) client module.

## Verify by hand

- Product, category, collection and blog pages: breadcrumb links soft-navigate and hover to foreground color.
