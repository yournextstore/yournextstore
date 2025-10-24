# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Your Next Store is a Next.js e-commerce application built with:
- **Next.js 16** with App Router, React Server Components, and experimental features (React Compiler, cache components)
- **Commerce Kit SDK** (`commerce-kit` package) - YNS API client for product browsing, cart management
- **Bun** runtime and package manager (instead of Node.js/npm/pnpm)
- **Tailwind CSS v4** for styling
- **Biome** for linting and formatting (instead of ESLint/Prettier)
- **TypeScript** with strict type checking

## Development Commands

### Running the app
```bash
bun dev              # Start dev server on port 3000
bun run build        # Production build
bun start            # Start production server
```

### Testing
```bash
bun test             # Run tests (uses bun:test, not Jest/Vitest)
```

### Linting and Formatting
```bash
bun run lint         # Check code with Biome (biome check)
bun run format       # Format code with Biome (biome format --write)
```

## Important: Use Bun, not Node.js

**Always use Bun instead of Node.js tools:**
- `bun <file>` instead of `node <file>` or `ts-node <file>`
- `bun test` instead of `jest` or `vitest`
- `bun install` instead of `npm install` / `pnpm install` / `yarn install`
- `bun run <script>` instead of `npm run <script>`
- Bun automatically loads `.env` files - don't use `dotenv` package

**Bun-specific APIs to prefer:**
- `Bun.file()` over `node:fs` readFile/writeFile
- `Bun.$\`command\`` over `execa` for shell commands
- `bun:test` for testing (see examples in existing CLAUDE.md)

## Architecture

### Commerce Integration

**YNS Client** (`src/yns-client.ts`):
- Singleton instance of `YnsProvider` from `commerce-kit`
- Configured with environment variables `YNS_API_TENANT` and `YNS_API_TOKEN`
- Main methods:
  - `ynsClient.productBrowse(params)` - Browse products with filtering
  - `ynsClient.productGet(params)` - Get single product by ID
  - `ynsClient.cartCreate(body)` - Create cart
  - `ynsClient.cartGet()` - Get cart

**Product Data Structure**:
- Products have `variants[]` array (each variant has `price`, `images`, `stock`, etc.)
- Product `images[]` are at product level; variant images at `variant.images[]`
- Prices are stored as strings representing minor currency units (e.g., "1999" = $19.99)

**Money Formatting** (`src/money.ts`):
- `formatMoney({ amount, currency, locale })` - Formats prices with proper currency symbols
- Handles edge-case currencies (zero-decimal like JPY, 3-decimal like KWD)
- Amount is expected as string/bigint/number in minor units

### Next.js Configuration

**Experimental Features Enabled** (`next.config.ts`):
- `reactCompiler: true` - React Compiler for automatic optimization
- `cacheComponents: true` - Component-level caching
- `typedEnv: true` - Type-safe environment variables

**Image Configuration**:
- Remote patterns allow `*.blob.vercel-storage.com` for product images
- Use Next.js `<Image>` component, not `<img>` tags

### Caching Strategy

Use Next.js "use cache" directive with `cacheLife()`:
```tsx
const ProductList = async () => {
  "use cache";
  cacheLife("seconds");
  // ... fetch data
}
```

### Styling Conventions

- **Tailwind CSS v4** for all styling (no CSS modules)
- Use responsive classes: `sm:`, `md:`, `lg:` breakpoints
- Common patterns: `max-w-7xl mx-auto px-4` for centered containers
- Grid layouts: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6`

## Code Standards

### Biome Configuration Highlights

**Enforced rules**:
- `noDefaultExport: "error"` - Except in App Router files (pages, layouts, etc.)
- `noExplicitAny: "error"` - No `any` types allowed
- `useExhaustiveDependencies: "error"` - Strict dependency arrays
- Import organization is automatic (Biome auto-organizes imports)
- Line width: 110 characters

**Key conventions**:
- Use `const` assertions and `as const` for literal types
- **NEVER use `for...of` loops** - use functional methods (`map`, `flatMap`, `reduce`, `filter`, etc.)
- **NEVER use `forEach` for mutations** - use `reduce` instead
- Use template literals appropriately
- No unused imports/variables (warns and auto-fixes)
- **Do NOT add unnecessary type annotations** - rely on type inference
- **Do NOT add return type annotations** unless absolutely necessary
- Components using `use cache` must be inside <Suspense> boundaries
- **Function prop names should NOT end with "Action"** unless they are actual server actions

### Environment Variables

Required in `.env.local`:
```bash
NEXT_PUBLIC_ROOT_URL="http://localhost:3000"
YNS_API_TENANT=https://yourdomain.yns.store
YNS_API_TOKEN=your_api_token_here
```

### File Organization

```
app/
  layout.tsx                    # Root layout with fonts and global providers
  page.tsx                      # Home page with product grid
  cart-button.tsx               # Shopping cart button component
  globals.css                   # Global Tailwind CSS imports
  product/[slug]/               # Dynamic product detail pages
    page.tsx                    # Product detail page
    actions.ts                  # Server actions (add to cart, etc.)
    add-to-cart-button.tsx      # Add to cart button with variants
    product-carousel.tsx        # Product image carousel
    variant-selector.tsx        # Product variant selection UI

src/
  yns-client.ts                 # Commerce SDK client singleton
  money.ts                      # Price formatting utilities
  lib.ts                        # Shared utilities (invariant, etc.)
  components/ui/                # Shadcn UI component library
    button.tsx                  # Button component
    card.tsx                    # Card component
    carousel.tsx                # Carousel component
    dialog.tsx                  # Dialog/modal component
    [...50+ components]         # Full Shadcn UI component set
  lib/
    utils.ts                    # Utility functions (cn for classnames, etc.)
  hooks/
    use-mobile.ts               # Mobile detection hook
```

### UI Component Library (Shadcn)

This project uses **Shadcn UI** components (50+ components in `src/components/ui/`):
- Components are **copied into the codebase** (not installed as npm package)
- All components use **Radix UI primitives** for accessibility
- Styled with **Tailwind CSS v4** and **class-variance-authority** (cva)
- Configuration in `components.json`

**Key components available**:
- Forms: `button`, `input`, `checkbox`, `radio-group`, `select`, `textarea`, `form`
- Layout: `card`, `dialog`, `drawer`, `sheet`, `tabs`, `accordion`, `separator`
- Navigation: `navigation-menu`, `breadcrumb`, `menubar`, `dropdown-menu`
- Data display: `table`, `badge`, `avatar`, `carousel`, `chart`
- Feedback: `alert`, `toast` (sonner), `progress`, `skeleton`, `spinner`

**Usage pattern**:
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

<Card>
  <CardHeader>
    <CardTitle>Product Name</CardTitle>
  </CardHeader>
  <CardContent>
    <Button variant="default" size="lg">Add to Cart</Button>
  </CardContent>
</Card>
```

## Common Patterns

### Fetching and Displaying Products

```tsx
const products = await ynsClient.productBrowse({ active: true, limit: 4 });

products.data.map((product) => {
  // Get price range from variants
  const prices = product.variants.map((v) => BigInt(v.price));
  const minPrice = prices.reduce((a, b) => (a < b ? a : b));

  // Get first available image
  const image = product.images[0] ?? product.variants[0]?.images[0];

  // Format price
  const priceDisplay = formatMoney({
    amount: minPrice,
    currency: "USD",
    locale: "en-US"
  });
});
```

### Type Safety

Use `invariant()` helper for runtime assertions:
```tsx
import { invariant } from "./lib";

invariant(process.env.YNS_API_TOKEN, "Missing env.YNS_API_TOKEN");
```

### Server Actions

Server actions are used for mutations (like adding to cart). Pattern:
```tsx
// app/product/[slug]/actions.ts
"use server";

import { cookies } from "next/headers";
import { ynsClient } from "../../../src/yns-client";

export async function addToCart(variantId: string) {
  const cookieStore = await cookies();
  const cartId = cookieStore.get("cartId")?.value;

  const cart = await ynsClient.cartCreate({
    cartId,
    variantId,
    quantity: 1,
  });

  if (!cart) {
    return { success: false };
  }

  // Store cart ID in httpOnly cookie
  cookieStore.set("cartId", cart.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });

  return { success: true, cartId: cart.id };
}
```

**Important**:
- Server actions must be in files with `"use server"` directive at the top
- Function names should NOT end with "Action" (Biome rule)
- Always return structured data `{ success: boolean, ... }`
- Use cookies for cart persistence (httpOnly for security)

## Important React/Next.js Patterns

### State Management and Side Effects

- **Avoid `useEffect` when possible** - prefer deriving state from props/searchParams using `useMemo`
- **Lift state up** when child components don't need to manage it themselves
- Query params should be the source of truth for URL-driven state (like variant selection)
- Use `useSearchParams` and `useRouter` to read and update URL state
- Always compute derived state in render (via `useMemo`) rather than syncing with effects

### URL-Friendly Patterns

- Store human-readable values in query params (e.g., `?Size=42&Color=Black`), not IDs
- Use variant value names in URLs for better UX and SEO
- Map between URL values and internal IDs as needed

### Component Libraries

- Use existing UI component libraries when available (e.g., `../../lib/utilscarousel`)
- Don't install unnecessary external packages - check what's already in the project first

## Notes

- Default export is prohibited except in Next.js App Router special files
- Currency/locale are currently hardcoded as USD/en-US (no i18n yet)
- TypeScript target requires `BigInt(0)` instead of `0n` literals for ES2020 compatibility
- Cart ID is stored in cookies (`cartId`) with 30-day expiry
