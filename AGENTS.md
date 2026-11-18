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
bun run publish:store                 # Production publish: deploys the commit at origin/main (commit and push first; refuses otherwise)
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

`instrumentation-client.ts` and `proxy.ts` carry the platform integration (`startTracking()` from
`commerce-kit/tracking` plus the `/_public/kit.js` injection, the `/_public` + `/checkout` proxies).
They are updated by platform releases only — the platform's tooling **rejects edits to
them, and any out-of-band change is restored to the platform version on every save**.

Storefront code makes no tracking calls. The platform tracking runtime reports page views, product
and collection views, searches, cart views, cart changes, checkouts and purchases by itself, from
the page's JSON-LD and the cart, and forwards them to the store's trackers once consent allows.
Three rules keep it working:

- Render the `structuredData` the API returns, as-is, with `JsonLdScript` and `apiStructuredData`
  from `lib/json-ld.tsx`: product pages (`product.structuredData`), collection pages
  (`collection.structuredData`), blog posts (`post.structuredData`) and the order confirmation
  page (`order.structuredData`). Each schema.org node has one owner: the API owns these entity
  nodes completely (reviews, the collection's product list and the blog post's author included),
  so never build your own `Product`, `CollectionPage`, `BlogPosting` or `Order` node and never add
  fields to the API's. The template owns the store-level nodes (`Organization`, `WebSite`, `Store`
  in `StoreJsonLd`) and the breadcrumbs. Two things have no API node, so the template declares them:
  the search page renders `buildSearchResultsJsonLd(query, products)` (a `SearchAction` with the
  query and the products shown, by id), and whatever shows the cart, a page or the open drawer,
  carries `data-yns-view="cart"` while it is on screen.
- Never add tracker snippets (fbq, gtag, GTM, pixels) to template code, and never report an event
  yourself: a cart add needs no call, the runtime re-reads the cart after the server action. A
  shopper's email from a sign-up goes to `visitor({ email })` from `commerce-kit/tracking`; a
  store-specific event goes to `publish(name, data)`.
- The cookie banner (`components/cookie-consent-banner.tsx`) is design only: it renders when
  `useConsent()` from `commerce-kit/tracking/react` says `bannerVisible`, and answers through
  `set(...)` with all four purposes (`analytics`, `marketing`, `preferences`, `sale_of_data`). It
  writes no cookie and no Consent Mode signal itself; the runtime does. Its `CookieSettingsLink`
  (in the footer) calls `open()` so a shopper can change the answer; `reopened` says the banner is
  showing again over an answer already given.

Newsletter unsubscribe and confirmation pages, digital downloads, and payment/carrier webhooks
live on the platform domain, not here — never add `/unsubscribe`, `/confirm-subscription`,
`/digital-assets` or `*-webhook` routes. `proxy.ts` only forwards the old addresses that were
already emailed or registered on this domain.

The home, product, collection, blog post and search pages also answer AI agents in Markdown, in
every language the store offers (a `/de/…` prefix reaches the platform as `?lang=de`): `proxy.ts`
rewrites a request that prefers `text/markdown` or `text/plain` (or adds `.md` to the address) to
the platform's Markdown version of the page (`lib/markdown.ts`). Never add local `.md` routes for
these pages. A page that lives only in this app (about, FAQ, …) has no Markdown version; a store
that wants one adds its own `beforeFiles` rewrite and route for those paths, never in `proxy.ts`.
Keep the page entries in the proxy matcher behind their `Accept` condition, so a browser's page
view never runs the proxy.

## Project Patterns

- Use `safe-try` for error handling: `const [error, result] = await try_(...)`
- Format prices with `formatMoney` from `lib/money.ts`
- No manual `useMemo`/`useCallback`: the React Compiler memoizes components (`reactCompiler` in `next.config.ts`)
- Show accepted payment methods with `PaymentMethods` from `components/payment-methods.tsx` (official marks from `commerce-kit/payment-icons`, keyed by Stripe payment method type, e.g. `blik`, `p24`, `apple_pay`). Never draw, type out or copy payment brand logos; render it from a Server Component
- Search box suggestions come from the platform's keyless `GET /_public/suggest?q=…` (`fetchSearchSuggestions` in `lib/search-suggest.ts`), which the browser and the CDN cache. Never fetch them through a Server Action: an action is a POST that nothing caches, and Next runs one at a time per client. The `/search` results page is separate and reads `productBrowse` on the server
- Use functional array methods (`map`, `filter`, `reduce`), not loops
- No `any` types; rely on type inference; minimal return type annotations
- **Always quote paths** with special characters in shell commands: `rg "term" "app/(auth)/login"`
- **ALL `/checkout` and `/account` links MUST be plain `<a>` tags.** Never use `<Link>` (or any link wrapper) for links into a proxied zone (`/checkout`, `/account`) — a soft RSC navigation into the cross-zone rewrite 500s.

## Shopper auth

There is **no auth in this app**. Shopper sign-in happens exclusively through the platform's unified account system: inline email-code sign-in inside the proxied `/checkout`, and the platform-rendered account area behind the proxied `/account` (see `proxy.ts`). Never add `/login` or `/signup` pages, auth forms, or session handling here — the only local piece is `app/api/auth/[...all]/route.ts`, a passthrough that forwards the platform components' client-side `/api/auth/*` calls (e.g. sign-out in the account area) to the apex backend.

## The prerendered shell

`cacheComponents` is on. Everything the root layout awaits before rendering the chrome ends up in the prerendered shell; anything request-time (`cookies()`, `headers()`, `searchParams`) takes it back out. So `app/layout.tsx` awaits **only cached reads**, and nothing per visitor is read on the server at all: `CartProvider` loads the cart in the browser from `GET /api/cart` (`app/api/cart/route.ts`, never cached) after hydration, once per full page load, and the cookie banner renders nothing on the server and appears in the browser once `useConsent()` says so.

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

The check also covers the page's own content: a document's first `<h1>` must not come after
`</main>` or inside a streamed segment (see "Prerendered catalog pages" below for what moves it).

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
- Listing controls never read `useSearchParams()`. The server hands them the active selection
  (`active`, via `activeParams` in `lib/listing-routes.ts`): empty on the static default view, the
  query on the `…-filtered` routes (see below).

### Prerendered catalog pages: no loading states

Every page a shopper can land on renders without a skeleton or spinner. Four rules keep it that way:

- **No `loading.tsx`, no route skeletons.** Product, category, collection, blog and legal pages list
  their known addresses with `generateStaticParams` (helpers in `lib/catalog-paths.ts`, shared with
  `app/sitemap.ts`), so every listed address prerenders in full. Only URL-safe slugs are listed
  (`isStaticSlug`): Next writes the path into a header while prerendering, and a space or non-ASCII
  letter fails the whole build.

  The page's default export is a sync wrapper that renders two siblings: `NotFoundGuard`
  (`components/not-found-guard.tsx`) and the async body. **The body is never inside a `<Suspense>`.**
  React moves a resolved boundary out of place, into a hidden `<div hidden id="S:…">` at the end of
  the HTML that a script puts back, once the bytes sent so far plus the boundary pass 12,800
  (`progressiveChunkSize`). Any page body is larger than that, so a boundary around it leaves
  `<main>` empty, with the `<h1>` after the footer, for every crawler that runs no scripts — even
  when the boundary resolved at build time. The guard is the one thing that does sit in a boundary:
  `notFound()` thrown above every boundary replaces the whole document with a bare error page
  (`<html id="__next_error__">`, no header or footer in the HTML), while thrown inside one it keeps
  the layout. The guard renders nothing, so React leaves it in place. The body returns `null` for a
  missing address instead of throwing; both read the same cached data. `scripts/check-shell.sh`
  fails the build when a document's first `<h1>` comes after `</main>` or inside a streamed segment.

  A missing page must answer 404, not 200. Next sends the status with the first byte, so a
  `notFound()` that runs after a shell went out keeps the 200 (a soft 404). Product, blog post,
  legal, collection and category pages therefore export `ensureStatic = "navigation"`: an address
  added after the build renders in full on its first request before anything is sent (and is
  cached from then on), so a missing one answers 404 with the not-found page inside the layout. The
  export also makes `next build` fail on any request-time read on those routes, so the category
  page has no `SearchParamsProbe`: a client-side visit to a filtered or paged category URL still
  reaches the server and its `/category-filtered` rewrite. Check with
  `curl -s -o /dev/null -w '%{http_code}' <store>/product/does-not-exist` (must print `404`).
- **No `<Suspense>` around cached data.** A `"use cache"` component inside a boundary still ships its
  fallback first and its content later in the same HTML (a late segment swapped in by `$RC`), so
  the shopper sees the skeleton while the document downloads, and a crawler finds the content
  outside `<main>`. It happens to a boundary that resolved at build time too, once the document
  passes 12,800 bytes (see above). Render cached sections directly, the way the related products on
  a product page do; keep boundaries for request-time reads.
- **The URL query is read in the browser.** Client components that need it use `useUrlQuery()` from
  `lib/url-query.ts` instead of `useSearchParams()`, and write the address with `setUrlQuery()`. The
  prerendered page renders the default and switches after hydration; `useSearchParams()` would turn
  the component into a per-request render behind a fallback.
- **The chosen variant lives after `#`.** The variant selector writes `/product/roma#Colour=Black`
  (`variantHash()`), and the selector, the gallery and `useSelectedVariant` read it with
  `useVariantQuery()`, which also accepts the older `?Colour=Black` form that ads, feeds and shared
  links still carry. A query string is a separate address for a crawler; what follows `#` is not.
  A link to one variant (the product card of a single-variant product) uses the `#` form too.
- **Listings: static default view, filtered views on their own route.** `/products` and
  `/category/…` never read the query, so they prerender. When a listing parameter (filter, sort,
  page) is present, `next.config.ts` rewrites the request (`listingRewrites()` in
  `lib/listing-routes.ts`, `beforeFiles`) to `/products-filtered` or `/category-filtered/…`, which
  render per request. The public URL never changes, and tracking parameters (`utm_*`, `gclid`) keep
  the static view. `proxy.ts` is platform-managed, which is why this lives in the config. `/products`
  keeps a `SearchParamsProbe` so the client router asks the server for a new query instead of
  reusing the static view; the category page can't (it is `ensureStatic = "navigation"`, see
  above), and a filtered or paged category URL reaches the server without it.

Pages that only make sense per request (search, the `…-filtered` listings, an order's thank-you
page) export `instant = false` and render in full per request: a navigation keeps the current page
on screen until the new one is ready, with no skeleton in between. Their prerendered `.html` is
empty, which `scripts/check-shell.sh` skips.

### Fully static routes

`/about`, `/faq`, `/contact` and `/blog` export `ensureStatic = "navigation"`, so `next dev` and
`next build` fail if anything on them renders per request, the root layout included. That covers:

- uncached data;
- `cookies()`, `headers()` and server-side `searchParams`;
- a `cacheLife` whose expire is under 5 minutes, stale under 30 seconds, or revalidate 0.

Per-visitor data loads in the browser instead, the way the cart and the consent
banner do. `next build --debug-prerender` prints full stack traces. A page that must render per
request drops the export line rather than working around the check.

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
  optimizer resize. While a photo loads, its frame shows the `bg-secondary` box it sits in. Never
  fetch a store photo on the server (for a per-photo blur, a dominant colour, …): only the
  optimizer reads originals from Blob, once per size. A server fetch repeats on every instance and
  revalidation, and each one downloads the full original (YNS-5812).
  `images.minimumCacheTTL` is a year: Blob URLs carry a random suffix, so a new photo is a new URL.
- **Prefetch on intent.** Product cards link with `IntentLink` (`components/intent-link.tsx`,
  adapted from vercel/shop): the shared App Shell by default, the full page once the shopper hovers,
  focuses or stops scrolling near the link, so the click shows content.
- **Contrast.** `app/palette.test.ts` asserts every text/surface token pair in `:root` and `.dark`
  clears WCAG AA (4.5:1), and an unparseable value fails rather than skips. When it trips, move the
  *text* token's lightness away from its surface's — darker on a light surface, lighter on a dark one
  such as `.dark` — and keep the tint: it is the design, the token clears AA on it.
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
  // query: "search text", category: "id", tags: ["tag"]
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
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { SearchResults } from "./search-results";

// The data read is cached; the request-time searchParams never enter the cache scope.
async function searchProducts(q: string) {
  "use cache";
  cacheLife("minutes");
  return commerce.productBrowse({ query: q, active: true });
}

// Results depend on the query, so the page renders in full per request: no skeleton, and a
// navigation keeps the current page until the results are ready.
export const instant = false;

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await props.searchParams;
  const products = q ? await searchProducts(q) : { data: [] };
  return <SearchResults products={products.data} query={q} />;
}
```

### Catalog page (prerendered per address)
```tsx
// app/collection/[slug]/page.tsx
import { getAllCollections, slugParams } from "@/lib/catalog-paths";

export async function generateStaticParams() {
  const collections = await getAllCollections().catch(() => []);
  return slugParams(collections.map((collection) => collection.slug));
}

// `params` awaited at the top: every listed collection prerenders in full, no skeleton.
export default async function CollectionPage(props: PageProps<"/collection/[slug]">) {
  const { slug } = await props.params;
  const collection = await getCollection(slug); // "use cache"
  // …
}
```

### Error handling
```tsx
import { commerce } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { getStoreConfig } from "@/lib/store-config";
import { try_ } from "safe-try";

// The SDK throws on any non-2xx response, a 404 included.
const [error, result] = await try_(
  commerce.productGet({ idOrSlug: productId })
);
if (error || !result) {
  return <div>Product not found</div>;
}
const { currency, locale } = await getStoreConfig();
const price = formatMoney({
  amount: result.variants[0].price,
  currency,
  locale,
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
| A build or page is slow | Unknown which Store API call | Run with `DEBUG_COMMERCE=1` (`bun dev` or `bun run build`): every call logs `[commerce] GET /path status 84ms` on the server |

## Agent Workflow Notes

- **Explore agent**: Start with `lib/commerce.ts`, `app/layout.tsx`, `app/page.tsx`. Search `"use server"`/`"use cache"` for patterns.
- **Plan agent**: Check existing code first. Map to: routes (`app/`), API (`lib/commerce.ts`), UI (`components/ui/`), actions (`actions.ts`). Consider caching and server vs client components.
- **Implementation agent**: Validate with commands above before and after changes. Follow Biome rules, reuse existing UI components.
- **Frontend design**: Use `frontend-design:frontend-design` skill to achieve a distinctive, production-grade frontend experiences.

**When starting work on the project, ALWAYS call the `init` tool from `next-devtools-mcp` FIRST to set up proper context and establish documentation requirements. Do this automatically without being asked.**

<!-- YNS-DOCS-START -->[YNS Docs]|base: https://yournextstore.com/docs/{section}/{slug}|Fetch with `Accept: text/markdown` header for raw markdown (token-efficient). YNS docs are the single source of truth hosted at yournextstore.com.|getting-started:{introduction,quick-start,first-store-setup}|storefront:{overview,installation,configuration,customization,deployment}|commerce-sdk:{overview,authentication,products,cart,orders,collections}|api-reference:{overview,products,variants,bundles,collections,categories,brands,inventory,search,reviews,orders,carts,customers,coupons,promotions,subscription-plans,loyalty,shipping,tax-rates,pickup-locations,events,tickets,posts,blog-categories,post-comments,subscribers,newsletters,contact-messages,media,images,brand-kit,socials,analytics,settings,team,domain,legal-pages,feedback-sessions}<!-- YNS-DOCS-END -->

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Git

- Commit straight to `main`: no feature branches, no pull requests.
- Keep history linear: `git pull --rebase` before `git push`, never a merge commit. Work from a worktree or agent branch lands by rebasing onto `main` and fast-forwarding.
