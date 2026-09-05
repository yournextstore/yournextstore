# AGENTS.md

Your Next Store — e-commerce app built with Next.js App Router + Commerce Kit SDK.

## Commands

```bash
bun dev           # Dev server (port 3000)
bun run build     # Production build + verify the prerendered shell (scripts/check-shell.sh)
bun start         # Production server
bun run lint      # Biome lint (--write to auto-fix)
bun run format    # Biome format
bun test          # Run tests (bun:test)
tsc --noEmit     # Type check
bun run check     # Everything but the build: biome check + tsc --noEmit + bun test
bun run audit <url> [--desktop]       # Lighthouse performance + accessibility on a running URL
bun run publish:store                 # Production publish (CLI twin of the admin "Publish" button; deploys remote main)
bun run api <METHOD> <path> [json]    # Call any Store API endpoint with the store key, e.g. bun run api GET /me
```

## Key Files & Directories

```
app/                  # Pages, layouts, actions (App Router)
components/ui/        # Shadcn UI components (add more with: bunx shadcn add <name>)
lib/commerce.ts       # Commerce API client
lib/money.ts          # Currency formatting (formatMoney)
lib/utils.ts          # Utilities
scripts/              # CLI helpers: api.sh (Store API caller), publish.sh (publish + wait),
                      # check-shell.sh (prerendered-shell gate), audit.sh (Lighthouse runner)
biome.json            # Lint/format config
next.config.ts        # Next.js config
```

## Platform-managed files — DO NOT MODIFY

`instrumentation-client.ts`, `lib/track.tsx`, and `proxy.ts` carry the platform integration
(analytics kit injection, the `track()` event contract, the `/_public` + `/checkout` proxies).
They are updated by platform releases only — the platform's tooling **rejects edits to
them, and any out-of-band change is restored to the platform version on every save**. Trackers, consent handling, and event forwarding live in
a platform-served script (`/_public/kit.js`, generated per store), so **never** add tracker
snippets (fbq, gtag, GTM, pixels) to template code. To track a commerce event from new UI,
call `track()` from `lib/track.tsx`.

## Project Patterns

- Use `safe-try` for error handling: `const [error, result] = await safe(...)`
- Format prices with `formatMoney` from `lib/money.ts`
- Use functional array methods (`map`, `filter`, `reduce`), not loops
- No `any` types; rely on type inference; minimal return type annotations
- **Always quote paths** with special characters in shell commands: `rg "term" "app/(auth)/login"`
- **ALL `/checkout` and `/account` links MUST be plain `<a>` tags.** Never use `<Link>` (or any link wrapper) for links into a proxied zone (`/checkout`, `/account`) — a soft RSC navigation into the cross-zone rewrite 500s.

## Shopper auth

There is **no auth in this app**. Shopper sign-in happens exclusively through the platform's unified account system: inline email-code sign-in inside the proxied `/checkout`, and the platform-rendered account area behind the proxied `/account` (see `proxy.ts`). Never add `/login` or `/signup` pages, auth forms, or session handling here — the only local piece is `app/api/auth/[...all]/route.ts`, a passthrough that forwards the platform components' client-side `/api/auth/*` calls (e.g. sign-out in the account area) to the apex backend.

## The prerendered shell

`cacheComponents` is on. Everything the root layout awaits before rendering the chrome ends up in the prerendered shell; anything request-time (`cookies()`, `headers()`, `searchParams`) takes it back out. So `app/layout.tsx` awaits **only cached reads**, and the one per-customer read — the cart cookie — sits in `CartBootstrapper`, inside its own Suspense boundary *below* the header and footer.

Do not hoist a request-time read above the chrome. The layout's Suspense boundaries have no fallback, so the cost is not a spinner: the shell prerenders empty and the page paints blank white until the server responds. That stays invisible during soft navigation (the old UI remains on screen) and is glaring on any full document load.

`bun run build` verifies this: after `next build` it runs `scripts/check-shell.sh` over every
`*.html` under `.next/server/app`, and a regression fails the build rather than the next Lighthouse
run. Counting headers is not enough — React writes the boundaries that resolved *after* the first
flush into the same static file, as `<div hidden id="S:…">` segments revealed by an inline `$RC`
script at the end, so a chrome that streamed still greps as present. The check compares byte
offsets: the header must come *before* the first such segment, or first paint waits for the whole
shell to parse and for that runtime script to run. To look at one document by hand:

```bash
grep -b -o -m1 '<header' .next/server/app/index.html | cut -d: -f1             # byte offset of the header
grep -b -o -m1 '<div hidden id="S:' .next/server/app/index.html | cut -d: -f1  # must be larger (or empty)
```

The same rule holds for a deployed store, because the static shell is the first flush of the live
response too: `bash scripts/check-shell.sh https://<store>/`. `YNS_SHELL_CHECK=warn` prints the
failures and exits 0 (the release valve when a store must ship anyway), `YNS_SHELL_CHECK=off` skips
the check entirely. Error documents are skipped by design — `_global-error` and anything that
resolved to `notFound()` while prerendering replace the root layout, so they carry no chrome to
measure.

Two corollaries, one for the chrome and one for listings:

- A chrome component that reads `usePathname()` or `useSearchParams()` sits inside its **own**
  `<Suspense>`, the way `SearchInput` does in the header. Never a boundary around the layout's
  children: the boundary itself is what streams the chrome out, whether or not anything inside it is
  request-time. The link primitive in particular must not read `usePathname()` — active styling goes
  in a small client component with its own boundary inside the nav.
- Listing controls that read `useSearchParams()` share the grid's boundary instead of sitting above
  it (`app/products/page.tsx`, `CategoryContent`): one skeleton for filters, sort and grid together,
  with the heading outside so it prerenders. Controls outside any boundary fail the build.

## Performance & accessibility baseline

The defaults below are load-bearing — every one of them came back as a Lighthouse finding on a live
store. Keep them when you touch the chrome, the tokens or a `<head>` asset.

- **`<head>` assets stay same-origin.** The favicon goes through the image optimizer
  (`getImageProps` inside `getStoreMetadata`), not the blob host: one `icon` entry with **no**
  `type` — declaring `image/svg+xml` over a PNG makes Chrome drop the icon and the optimizer
  negotiates the format anyway — and `apple` left on the original URL because iOS wants a real PNG.
  `app/favicon.ico/route.ts` redirects to the same optimizer URL. `manifest.webmanifest` icons stay
  PNG (PWA installs need them).
- **Fonts.** Variable faces, no `weight` arrays beyond what is used, and `preload: false` for any
  face that does not paint above the fold — `Geist_Mono` only appears in chat and code spans, so it
  loads on use instead of blocking every first paint. `Geist` stays preloaded.
- **Images.** `priority` only on the LCP image, never on something the viewport may not show.
  Never `unoptimized` on platform media: pass `sizes` matching the box it renders into and let the
  optimizer resize.
- **Contrast.** `app/palette.test.ts` asserts every text/surface token pair in `:root` and `.dark`
  clears WCAG AA (4.5:1), and an unparseable value fails rather than skips. When it trips, darken
  the *text* token — the tint is the design, the token clears AA on it.
- **Touch targets.** Interactive elements are ≥ 24×24 CSS px. Use the `Button` sizes (`icon-sm` for
  icon buttons); never shrink one back down with `h-auto p-1`. A decorative dot belongs in an
  `aria-hidden` span inside a 24 px button, not as the button.
- **Fixed docks.** The "Made with YNS" badge, the chat launcher and the newsletter launcher all sit
  at `z-50`/`bottom-4`; the consent banner is `z-[60]` so its controls stay above them and clickable.
- **Measure it.** `bun run audit <url>` against `bun start` while working, and
  `bun run audit https://<store>/` after publishing. The accessibility audits are deterministic —
  a failure is a real defect; the simulated performance numbers swing ±0.3 s run to run, so compare
  trends, and PageSpeed on the live URL is the score that counts.

## Adding locales

The storefront ships single-locale. If you add locales, put **every** locale behind a real route segment (`app/[locale]/…`) and map the unprefixed default-locale URLs onto it. That mapping is split, and the split is not stylistic:

| URL | Where | Why |
|---|---|---|
| `/` | `proxy.ts` | a `rewrites()` entry whose `source` is the bare `"/"` gets no RSC twin |
| `/:path*` | `next.config.ts` `afterFiles` | proxy runs *before* the public directory and would swallow `/logo.svg` |

A bare-`"/"` rewrite makes the router's flight request for the root (`/?_rsc=…`, `RSC: 1`) resolve to the HTML route and return `text/html`. Next soft-navigates only on `text/x-component`, so every in-app navigation to `/` — the header logo, the locale switcher back to the default language — degrades to a full document load. Path rewrites are unaffected because the `.rsc` suffix rides along inside the param, which is why this breaks exactly one URL and reads like a rendering bug rather than a routing one. `proxy.ts` sees the real request, RSC header included, so `NextResponse.rewrite` keeps the response a flight payload.

The reverse pull is just as real: proxy is step 3 of the routing order and the `public/` directory is step 5, so a broad proxy matcher rewrites static assets into the locale segment and 404s them. Keep the proxy matcher on `"/"`.

```bash
curl -sI -H 'RSC: 1' https://<store>/ | grep content-type   # must be text/x-component
```

## Biome Rules

Avoid: default exports, `any`, `for...of`, `forEach` for mutations, missing hook deps, unnecessary type annotations, function names ending with "Action" (unless server action).

Default export exceptions (Biome-allowed): `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.

Prefer: named exports, `map`/`filter`/`reduce`, type inference, `as const`, template literals.

## Commerce Kit SDK

```tsx
// Product browsing
const products = await commerce.productBrowse({
  active: true, limit: 12, offset: 0,
  // search: "query", category: "id", tags: ["tag"]
});

// Product details (accepts ID or slug)
const product = await commerce.productGet({ idOrSlug: productId });
// product.variants[].{id, price (minor units string), stock, images, attributes}

// Cart
const cart = await commerce.cartUpsert({ cartId, variantId: "v-123", quantity: 1 });
const cart = await commerce.cartGet({ cartId });
```

## Code Examples

### Page with caching
```tsx
// app/search/page.tsx
import { commerce } from "@/lib/commerce";
import { SearchResults } from "./search-results";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  "use cache";
  const { q } = await searchParams;
  const products = q
    ? await commerce.productBrowse({ search: q, active: true })
    : { data: [] };
  return <SearchResults products={products.data} query={q} />;
}
```

### Error handling
```tsx
import { commerce } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { safe } from "safe-try";

const [error, result] = await safe(
  commerce.productGet({ idOrSlug: productId })
);
if (error || !result) {
  return <div>Product not found</div>;
}
const price = formatMoney({
  amount: result.variants[0].price,
  currency: "USD",
  locale: "en-US",
});
```

### Unit test (bun:test)
```typescript
import { test, expect } from "bun:test";
import { formatMoney } from "@/lib/money";

test("formatMoney handles USD correctly", () => {
  const result = formatMoney({ amount: "1999", currency: "USD", locale: "en-US" });
  expect(result).toBe("$19.99");
});
```

## Checks run locally, not in CI

There is no GitHub Actions workflow — the husky `pre-commit` hook is the only automated gate. It
runs `lint-staged`: Biome over the staged files, then `bun tsc --noEmit` and `bun test` whenever a
`.ts`/`.tsx` file is staged, plus `bun test app/palette.test.ts` whenever `app/globals.css` is
staged — a CSS-only commit stages no TypeScript, so the contrast assertions would otherwise never
run on the one file that can break them. `bun run check` runs the whole suite by hand.

`bun run build` stays out of both, because prerendering reads live store data through `YNS_API_KEY`.
Run it yourself before publishing — it is also where the prerendered-shell check runs.

## Validation Checklist

- [ ] `tsc --noEmit` — no type errors
- [ ] `bun run lint` — no lint errors
- [ ] `bun run format` — code formatted
- [ ] `bun test` — tests pass (includes the palette contrast assertions)
- [ ] `bun run build` — build succeeds, including the prerendered-shell check
- [ ] `bun run audit <url>` — accessibility ≥ 0.98, no new failing audits
- [ ] `bun dev` — runs without errors, feature works in browser
- [ ] No console errors, images load, responsive layout
- [ ] No hardcoded secrets; env vars set (`.env.local` / Vercel dashboard)

Required env: `YNS_API_KEY`

## Troubleshooting

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot read property 'variants' of undefined` | Product data missing | Use optional chaining (`product?.variants`) |
| `Missing env.YNS_API_KEY` | Env not loaded | Create `.env.local`, restart dev server |
| `noDefaultExport` | Default export in non-special file | Use named export |
| `BigInt literal syntax` | Using `0n` with ES2020 | Use `BigInt(0)` |

## Agent Workflow Notes

- **Explore agent**: Start with `lib/commerce.ts`, `app/layout.tsx`, `app/page.tsx`. Search `"use server"`/`"use cache"` for patterns.
- **Plan agent**: Check existing code first. Map to: routes (`app/`), API (`lib/commerce.ts`), UI (`components/ui/`), actions (`actions.ts`). Consider caching and server vs client components.
- **Implementation agent**: Validate with commands above before and after changes. Follow Biome rules, reuse existing UI components.
- **Frontend design**: Use `frontend-design:frontend-design` skill to achieve a distinctive, production-grade frontend experiences.

**When starting work on the project, ALWAYS call the `init` tool from `next-devtools-mcp` FIRST to set up proper context and establish documentation requirements. Do this automatically without being asked.**

<!-- YNS-DOCS-START -->[YNS Docs]|base: https://yournextstore.com/docs/{section}/{slug}|Fetch with `Accept: text/markdown` header for raw markdown (token-efficient). YNS docs are the single source of truth hosted at yournextstore.com.|getting-started:{introduction,quick-start,first-store-setup}|storefront:{overview,installation,configuration,customization,deployment}|commerce-sdk:{overview,authentication,products,cart,orders,collections}|api-reference:{overview,products,variants,bundles,collections,categories,brands,inventory,search,reviews,orders,carts,customers,coupons,promotions,subscription-plans,loyalty,shipping,tax-rates,pickup-locations,events,tickets,posts,blog-categories,post-comments,subscribers,newsletters,contact-messages,media,images,brand-kit,socials,analytics,settings,team,domain,legal-pages,feedback-sessions}<!-- YNS-DOCS-END -->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
