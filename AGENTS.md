# AGENTS.md

Your Next Store — e-commerce app built with Next.js App Router + Commerce Kit SDK.

## Commands

```bash
bun dev           # Dev server (port 3000)
bun run build     # Production build
bun start         # Production server
bun run lint      # Biome lint (--write to auto-fix)
bun run format    # Biome format
bun test          # Run tests (bun:test)
tsgo --noEmit     # Type check
```

## Key Files & Directories

```
app/                  # Pages, layouts, actions (App Router)
components/ui/        # Shadcn UI components (50+)
lib/commerce.ts       # Commerce API client
lib/money.ts          # Currency formatting (formatMoney)
lib/utils.ts          # Utilities
biome.json            # Lint/format config
next.config.mjs       # Next.js config
hooks/                # Custom React hooks
```

## Project Patterns

- Use `safe-try` for error handling: `const [error, result] = await safe(...)`
- Format prices with `formatMoney` from `lib/money.ts`
- Use functional array methods (`map`, `filter`, `reduce`), not loops
- No `any` types; rely on type inference; minimal return type annotations
- **Always quote paths** with special characters in shell commands: `rg "term" "app/(auth)/login"`

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

## Validation Checklist

- [ ] `tsgo --noEmit` — no type errors
- [ ] `bun run lint` — no lint errors
- [ ] `bun run format` — code formatted
- [ ] `bun test` — tests pass
- [ ] `bun run build` — build succeeds
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

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-cache-components.mdx,07-fetching-data.mdx,08-updating-data.mdx,09-caching-and-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route-segment-config.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,browserDebugInfoInTerminal.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->
