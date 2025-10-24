# AGENTS.md

This file provides specialized guidance for Claude Code agents when working with the Your Next Store e-commerce application.

## Agent Workflows

### 1. Exploration Agent (subagent_type: Explore)

**When to use**: Understanding codebase structure, finding related code, analyzing architecture

**Common tasks**:
- "How does product filtering work?"
- "Where is cart state managed?"
- "Find all components that use the YNS client"
- "What UI components are available?"

**Search strategy**:
- Start with key files: `src/yns-client.ts`, `app/layout.tsx`, `app/page.tsx`
- Look in `app/product/[slug]/` for product-related features
- Check `src/components/ui/` for available UI components
- Search for patterns: `"use server"` for server actions, `"use cache"` for cached components

**Key file patterns**:
```
app/**/page.tsx       # Page components (allow default export)
app/**/layout.tsx     # Layout components (allow default export)
app/**/actions.ts     # Server actions (must have "use server")
src/components/ui/**  # Shadcn UI components
src/yns-client.ts     # Commerce API client
src/money.ts          # Currency formatting
```

### 2. Planning Agent (subagent_type: Plan)

**When to use**: Breaking down complex features, architectural decisions, refactoring plans

**Planning approach**:
1. **Understand requirements**: Clarify what needs to be built
2. **Check existing code**: Use Explore agent or Grep to find related implementations
3. **Identify components needed**:
   - New page routes? → `app/[route]/page.tsx`
   - New API integration? → Extend `src/yns-client.ts` or use existing methods
   - UI components? → Check `src/components/ui/` first before creating new ones
   - Server actions? → Create `actions.ts` in relevant app directory
4. **Consider performance**:
   - Can this use `"use cache"` directive?
   - Should this be a server component or client component?
   - Will this impact Core Web Vitals?
5. **Plan validation**: What tests are needed? What edge cases to handle?

**Example plan structure**:
```markdown
## Feature: [Feature Name]

### Requirements
- [ ] Requirement 1
- [ ] Requirement 2

### Architecture Decisions
- Server Component vs Client Component: [Decision + reasoning]
- Caching strategy: [Strategy]
- Data fetching: [Approach]

### Implementation Steps
1. Create/modify routes in `app/`
2. Add server actions if needed
3. Integrate with YNS client
4. Add UI components (reuse from `src/components/ui/`)
5. Add error handling
6. Add loading states
7. Test functionality

### Performance Impact
- Initial load: [Expected impact]
- Runtime: [Expected impact]
- Caching: [Strategy and benefits]

### Testing Strategy
- [ ] Unit tests for utilities
- [ ] Integration tests for API calls
- [ ] Manual testing steps
```

### 3. Implementation Agent (subagent_type: general-purpose)

**When to use**: Building features, fixing bugs, refactoring code

**Development workflow**:

#### Phase 1: Setup and Validation
```bash
# Verify environment
bun dev  # Ensure dev server starts on port 3000

# Check types
tsgo --noEmit

# Check linting
bun run lint
```

#### Phase 2: Implementation
- **Follow Biome rules** (see CLAUDE.md Code Standards section)
- **Use existing patterns** from similar features
- **Reuse UI components** from `src/components/ui/`
- **Type safety**: No `any`, rely on inference, minimal return type annotations

#### Phase 3: Testing
```bash
# Run type check
tsgo --noEmit

# Run linter (will auto-fix some issues)
bun run lint

# Format code
bun run format

# Run tests
bun test

# Test in browser
bun dev
```

#### Phase 4: Validation Checklist
- [ ] No TypeScript errors (`tsgo --noEmit`)
- [ ] No Biome lint errors (`bun run lint`)
- [ ] Code is formatted (`bun run format`)
- [ ] Tests pass (`bun test`)
- [ ] Dev server runs without errors (`bun dev`)
- [ ] Feature works in browser (manual test)
- [ ] No console errors or warnings
- [ ] Images load correctly (if applicable)
- [ ] Mobile responsive (check at different breakpoints)

## Common Agent Tasks

### Adding a New Product Feature

**Steps**:
1. Check YNS Commerce Kit SDK documentation or existing usage in `src/yns-client.ts`
2. Determine if the API method already exists or needs to be added
3. Create page in `app/` directory (use App Router conventions)
4. Use server components for data fetching with `"use cache"` directive
5. Create server actions in `actions.ts` for mutations
6. Use Shadcn UI components from `src/components/ui/`
7. Test thoroughly

**Example: Product Search**
```tsx
// app/search/page.tsx
import { ynsClient } from "@/yns-client";
import { SearchResults } from "./search-results";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  "use cache";
  const { q } = await searchParams;

  const products = q
    ? await ynsClient.productBrowse({ search: q, active: true })
    : { data: [] };

  return <SearchResults products={products.data} query={q} />;
}
```

### Adding a New UI Component

**Before creating**:
1. Check if component exists in `src/components/ui/` (50+ components available)
2. Check if composition of existing components works
3. If truly needed, follow Shadcn patterns:
   - Use Radix UI primitives when possible
   - Style with Tailwind CSS
   - Use `class-variance-authority` (cva) for variants
   - Export named components (no default exports)

**Installation via CLI** (if Shadcn component not yet added):
```bash
# Install specific Shadcn component
npx shadcn@latest add [component-name]
```

### Integrating a New Commerce Kit Method

**Steps**:
1. Check Commerce Kit SDK documentation for available methods
2. Add method call in `src/yns-client.ts` or use directly via `ynsClient`
3. Handle errors appropriately (use `safe-try` package for error handling)
4. Format money values using `formatMoney` from `src/money.ts`
5. Type the response (Commerce Kit provides TypeScript types)

**Example**:
```tsx
import { ynsClient } from "@/yns-client";
import { formatMoney } from "@/money";
import { safe } from "safe-try";

const [error, result] = await safe(
  ynsClient.productGet({ id: productId })
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

### Debugging Type Errors

**Process**:
1. Run `tsgo --noEmit` to see all type errors
2. Check for common issues:
   - Missing `await` on async functions
   - Incorrect use of `searchParams` (should be `await searchParams`)
   - Using `BigInt` literals (`0n`) instead of `BigInt(0)` (ES2020 compat)
   - Unnecessary type annotations (Biome will warn)
3. Fix one error at a time (often cascading fixes)
4. Re-run `tsgo --noEmit` to verify

### Optimizing Performance

**Caching strategy**:
```tsx
// For data that changes infrequently
async function ProductList() {
  "use cache";
  cacheLife("hours"); // or "seconds", "minutes", "days", "weeks"

  const products = await ynsClient.productBrowse({ active: true });
  return <div>{/* render */}</div>;
}

// Wrap in Suspense in parent
<Suspense fallback={<Skeleton />}>
  <ProductList />
</Suspense>
```

**Performance checklist**:
- [ ] Use `"use cache"` directive for data fetching
- [ ] Use `<Suspense>` boundaries for loading states
- [ ] Optimize images with Next.js `<Image>` component
- [ ] Use server components by default (client components only when needed)
- [ ] Minimize client-side JavaScript bundle
- [ ] Use streaming for long responses

### Handling Errors Gracefully

**Pattern**:
```tsx
// Use safe-try for error handling
import { safe } from "safe-try";

const [error, cart] = await safe(
  ynsClient.cartGet()
);

if (error) {
  console.error("Failed to fetch cart:", error);
  return <div>Unable to load cart. Please try again.</div>;
}

if (!cart) {
  return <EmptyCart />;
}

// ... render cart
```

**Error boundaries**:
- Next.js App Router provides automatic error boundaries via `error.tsx`
- Create `app/error.tsx` or `app/[route]/error.tsx` for custom error UI

## Agent Collaboration Patterns

### Sequential Workflow
For complex features requiring multiple agents:

1. **Explore Agent** → Understand existing code structure
2. **Plan Agent** → Create implementation plan
3. **Implementation Agent** → Build the feature
4. **Test Agent** → Validate and test

### Parallel Workflow
For independent tasks:

Run multiple agents concurrently:
- One agent adds new UI components
- Another agent adds server actions
- Another updates tests

Merge results after all complete.

## Project-Specific Guidelines

### Next.js App Router Patterns

**File-based routing**:
- `(parentheses)` in folder names = route groups (don't affect URL)
- `[brackets]` in folder names = dynamic routes
- When using tools like `grep` or `rg`, **always quote paths** with special characters:
  ```bash
  # CORRECT
  rg "searchTerm" "app/(auth)/login"

  # WRONG (will fail)
  rg "searchTerm" app/(auth)/login
  ```

**Special files**:
- `page.tsx` - Page component (default export allowed)
- `layout.tsx` - Layout component (default export allowed)
- `loading.tsx` - Loading UI (default export allowed)
- `error.tsx` - Error UI (default export allowed)
- `not-found.tsx` - 404 UI (default export allowed)
- `route.ts` - API route (default export NOT used, named exports: GET, POST, etc.)

### Commerce Kit SDK Patterns

**Product browsing**:
```tsx
const products = await ynsClient.productBrowse({
  active: true,
  limit: 12,
  offset: 0,
  // Optional filters:
  // search: "query",
  // category: "category-id",
  // tags: ["tag1", "tag2"],
});
```

**Product details**:
```tsx
const product = await ynsClient.productGet({
  id: productId,
  // OR
  slug: productSlug,
});

// Products have variants
product.variants.map(variant => ({
  id: variant.id,
  price: variant.price, // string in minor units
  stock: variant.stock,
  images: variant.images,
  attributes: variant.attributes, // e.g., { Size: "42", Color: "Black" }
}));
```

**Cart management**:
```tsx
// Create or update cart
const cart = await ynsClient.cartCreate({
  cartId, // existing cart ID or undefined for new
  variantId: "variant-123",
  quantity: 1,
});

// Get current cart
const cart = await ynsClient.cartGet();
```

### Biome Linting Patterns

**Auto-fix issues**:
```bash
# Check and auto-fix
bun run lint --write

# Or just check
bun run lint
```

**Common violations to avoid**:
- ❌ Default exports (except in special Next.js files)
- ❌ `any` types
- ❌ `for...of` loops (use `map`, `reduce`, `filter`)
- ❌ `forEach` for mutations (use `reduce`)
- ❌ Missing exhaustive dependencies in hooks
- ❌ Unnecessary type annotations
- ❌ Function names ending with "Action" (unless actual server action)

**Preferred patterns**:
- ✅ Named exports
- ✅ Functional array methods (`map`, `filter`, `reduce`)
- ✅ Type inference
- ✅ `const` assertions (`as const`)
- ✅ Template literals

## Testing Strategies

### Manual Testing Checklist

**For new features**:
- [ ] Feature works on desktop (Chrome, Firefox, Safari)
- [ ] Feature works on mobile (responsive design)
- [ ] Loading states display correctly
- [ ] Error states display correctly
- [ ] Form validation works (if applicable)
- [ ] Navigation works correctly
- [ ] Images load and display correctly
- [ ] No console errors or warnings
- [ ] Network requests succeed (check Network tab)
- [ ] State updates correctly (React DevTools)

**For e-commerce features**:
- [ ] Product images load and carousel works
- [ ] Variant selection updates price and image
- [ ] Add to cart creates/updates cart correctly
- [ ] Cart persists across page reloads (cookie)
- [ ] Out of stock variants are disabled
- [ ] Price formatting is correct (currency, decimals)

### Automated Testing

**Type checking**:
```bash
tsgo --noEmit
```

**Linting**:
```bash
bun run lint
```

**Unit tests** (using bun:test):
```typescript
import { test, expect } from "bun:test";
import { formatMoney } from "@/money";

test("formatMoney handles USD correctly", () => {
  const result = formatMoney({
    amount: "1999",
    currency: "USD",
    locale: "en-US",
  });
  expect(result).toBe("$19.99");
});
```

## Deployment Workflow

### Pre-deployment Checklist

- [ ] All tests pass (`bun test`)
- [ ] No TypeScript errors (`tsgo --noEmit`)
- [ ] No linting errors (`bun run lint`)
- [ ] Code is formatted (`bun run format`)
- [ ] Build succeeds (`bun run build`)
- [ ] Environment variables are set (`.env.local` for local, Vercel dashboard for production)
- [ ] No hardcoded secrets or API keys
- [ ] Images are optimized
- [ ] Performance is acceptable (check Lighthouse scores)

### Build Process

```bash
# Production build
bun run build

# Test production build locally
bun start

# Visit http://localhost:3000 to verify
```

### Environment Variables

**Required for production**:
- `YNS_API_TENANT` - Your YNS store URL
- `YNS_API_TOKEN` - YNS API authentication token
- `NEXT_PUBLIC_ROOT_URL` - Your deployed URL (for OpenGraph, etc.)

**Vercel deployment**:
1. Set environment variables in Vercel dashboard
2. Push to main branch or create PR
3. Vercel automatically builds and deploys
4. Check deployment logs for errors

## Troubleshooting Guide

### Common Issues

**Issue**: `TypeError: Cannot read property 'variants' of undefined`
- **Cause**: Product data not loaded or invalid
- **Fix**: Add null checks, use optional chaining (`product?.variants`)

**Issue**: `Error: Invariant failed: Missing env.YNS_API_TOKEN`
- **Cause**: Environment variables not loaded
- **Fix**: Create `.env.local` with required variables, restart dev server

**Issue**: Biome error `noDefaultExport: "error"`
- **Cause**: Default export in non-special file
- **Fix**: Use named export instead, or check if file should be in `app/` with special name

**Issue**: `BigInt literal syntax is not available`
- **Cause**: Using `0n` syntax with ES2020 target
- **Fix**: Use `BigInt(0)` instead of `0n`

**Issue**: Images not loading
- **Cause**: Remote image domain not allowed in `next.config.mjs`
- **Fix**: Add domain to `images.remotePatterns` in config

**Issue**: `useSearchParams` causing hydration errors
- **Cause**: Using in server component
- **Fix**: Accept `searchParams` as prop instead, or wrap in client component

### Debug Tools

**TypeScript**:
```bash
tsgo --noEmit --pretty  # Pretty-printed errors
```

**Biome**:
```bash
bun run lint --verbose   # Detailed lint output
```

**Next.js**:
```bash
bun dev --turbo          # Turbopack for faster dev (if supported)
bun run build --debug    # Debug build issues
```

**Browser DevTools**:
- React DevTools extension (component tree, props, state)
- Network tab (API requests, response times)
- Console (errors, warnings, logs)
- Performance tab (Core Web Vitals)

## Quick Reference

### Key Commands
```bash
bun dev           # Start dev server (port 3000)
bun run build     # Production build
bun start         # Start production server
bun run lint      # Biome lint check
bun run format    # Biome format
bun test          # Run tests
tsgo --noEmit     # Type check
```

### Key Files
- `src/yns-client.ts` - Commerce API client
- `src/money.ts` - Currency formatting
- `src/lib.ts` - Utility functions
- `biome.json` - Linting and formatting config
- `next.config.mjs` - Next.js configuration
- `tsconfig.json` - TypeScript configuration

### Key Directories
- `app/` - Next.js App Router pages and routes
- `src/components/ui/` - Shadcn UI component library
- `src/lib/` - Shared utilities
- `src/hooks/` - Custom React hooks

### Important Patterns
- Server components by default
- Client components: add `"use client"` directive
- Server actions: add `"use server"` directive
- Caching: add `"use cache"` directive + `cacheLife()`
- Always wrap cached components in `<Suspense>`
- Use functional array methods, not loops
- Quote file paths with special characters in commands
