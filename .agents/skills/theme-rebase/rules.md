# Theme conflict rules

How to resolve a conflict between `main` and a theme. `theme-rebase.sh` gives these rules to the agent it starts for a theme, and anyone finishing a theme by hand follows them too ([SKILL.md](SKILL.md)).

## The setup

The working tree is `main` with the theme squash-merged on top (`git merge --squash`), so a theme ends up as one commit on `main`. Conflict markers are zdiff3:
- `<<<<<<< ours` = **MAIN** (logic updates, SDK changes, bug fixes, deps)
- `|||||||` = the merge base
- `>>>>>>> theirs` = **THEME** (visual design, JSX, components, classNames, styling)

The script settles `bun.lock`, `package.json` and every path only copied commits touched before you start; those take main's side. The rest is yours.

## Guardrails

- Fix the theme's code, never the checks: don't edit tests, `scripts/`, `tsconfig.json`, `biome.json`, `lint-staged.config.mjs`, or the `check`, `build`, `lint` and `test` scripts in `package.json`. The script sends any such change to review.
- `/about`, `/faq`, `/contact` and `/blog` export `ensureStatic = "navigation"` (AGENTS.md, "Fully static routes"), so the build fails if anything on them renders per request, the theme's root layout included. A `<Suspense>` does not satisfy it. Move a theme's own cookie or header read into the browser the way main reads the cart. Drop the `ensureStatic` line only for a page that truly renders per request; that sends the theme to review.
- Don't commit, switch branches or rewrite history. The script commits once the checks and the build pass.

## When a file merged cleanly but fails

Theme-owned files still import modules main deleted or moved. To find what replaced a path: `git log --diff-filter=D --format='%h %s' <base>..<main> -- '<path>'`, then `git show --stat <sha>`. Known as of October 2026:

- `components/yns-link.tsx` is gone; use `next/link` (see `components/yns-link.tsx` below).
- `app/search-input.tsx` was split into `components/search/` (`search-input.tsx`, `mobile-search-input.tsx`, `suggestions.tsx`, …). Port the theme's search styling there.
- The auth tree (`app/(auth)/`, `components/auth-button.tsx`, `lib/auth*.ts`) is gone: shopper sign-in lives on the platform. A sign-in button becomes a plain `<a href="/account">`, never a `<Link>` (AGENTS.md).
- `CartProvider` takes only `children` (see `app/layout.tsx` below).
- Prices read the store's currency and locale from `useStoreConfig()` (`components/store-config-provider.tsx`) in client components and `getStoreConfig()` on the server.
- The footer's copyright year comes from a cached `getCopyrightYear()`, because the footer is prerendered.

## Contrast

`app/palette.test.ts` asserts the theme's own `app/globals.css` clears WCAG AA (4.5:1) for each text/surface token pair, and reports the failing pair and the ratio. Fix it in the theme's CSS by moving the **text** token's lightness away from its surface's in steps of 0.02 — darker on a light surface, lighter on a dark one such as `.dark` — keeping chroma and hue untouched (on a light surface: `oklch(0.556 0.02 250)` → `oklch(0.536 0.02 250)` → …), re-running `bun test app/palette.test.ts` after each step. Never move the surface/tint token: the tint is the theme's identity.

## Conflict resolution strategies by file type

**CSS files (`*.css`)**
ALWAYS prefer the theme branch (theirs). Keep all theme colors, fonts, spacing, variables, and visual styling. Only add new CSS rules or variables from main (ours) that don't exist in the theme. Never replace or remove theme-specific styles.

**React/JSX files (`*.tsx`, `*.jsx`)**
START from the theme branch (theirs) code — copy it as-is. Then carefully port logic changes from main (ours) INTO the theme code: updated hooks, state, event handlers, data fetching, SDK/API calls, utility functions, types, and imports. Keep the theme's JSX structure, components, className attributes, Tailwind classes, styling, and layout UNCHANGED. The final file must LOOK like the theme but have main's updated logic. NEVER start from main's code and restyle it — always start from theme and add main's logic into it. **If main introduces entirely new JSX elements, sections, or components that don't exist in the theme yet, you MUST restyle them to match the theme** — use the theme's color palette, typography, Tailwind class conventions, spacing, and component patterns. Study 2-3 nearby theme components as a reference for the correct visual style.

**`app/layout.tsx`**
Keep the theme's chrome — its header markup, nav, footer, classNames, fonts — but the resolved file MUST match main's data flow, because main now gates the build on it (`scripts/check-shell.sh`, see AGENTS.md "The prerendered shell"). Three things are non-negotiable, and every theme today violates the first:

- **The layout reads no cookie.** Main's `CartProvider` takes only `children` and loads the cart in the browser through the `getCart` action. Themes still read it on the server, either `await getInitialCart()` inside `CartProviderWrapper` or a `CartBootstrapper` block. Delete that read: `getInitialCart`, `CartBootstrapper` with its `<Suspense>`, the `initialCart`/`initialCartId`/`bootstrap` props, and the imports left unused (`getCartCookieJson` stays in `lib/cookies.ts` for the cart actions).
- **No `<Suspense>` around `CartProviderWrapper` or around the layout's `children`.** The boundary alone streams the chrome out of the prerendered shell, even when everything inside it is cached. Delete it if the theme side has one.
- `getNavLinks` (and any other read the wrapper awaits) stays `"use cache"`.

A chrome component of the theme's own that reads `usePathname()` or `useSearchParams()` — a locale switcher, an active-nav highlighter — goes inside its own `<Suspense>` inside the nav, the way `SearchInput` does.

**`components/yns-link.tsx`**
Main **deleted** this file (`a6aca22`); the theme still has it and its nav/footer still import it. Do not resurrect it. Delete the file and switch every `YnsLink` import to `next/link` (`import Link from "next/link"`), dropping the `activeClassName` and `exactHrefMatch` props at each call site. The primitive read `usePathname()`, which is what pulled the whole chrome out of the prerendered shell. If the theme's design depends on active-link styling, keep it by extracting a small `"use client"` component that reads `usePathname()` and renders the class, and wrap **that** in `<Suspense>` inside the nav — never the link primitive itself.

**`package.json`**
Merge both: use main's (ours) dependency versions for shared packages, but keep any theme-only additions from the theme (theirs). Ensure valid JSON. After resolving, run `bun install` and `git add bun.lock`. Take main's `scripts` wholesale unless the theme genuinely added one — `build` now chains the shell check and must keep doing so.

**`bun.lock`**
Never resolve manually. Run `bun install` to regenerate, then `git add bun.lock`.

**`next.config.ts` / `next.config.mjs` / `next.config.js`**
Keep the theme's (theirs) config as the base. Only add new config options from main (ours) that don't already exist in the theme. Preserve all theme-specific entries (remotePatterns, image domains, rewrites).

**Tailwind config files**
ALWAYS prefer the theme branch (theirs). Keep all theme customizations, colors, fonts, extensions. Only add new utilities or plugins from main (ours) that don't conflict.

**All other files**
Start from the theme branch (theirs) code. Port logic fixes, type fixes, SDK changes, and bug fixes from main (ours) into the theme code. Never replace theme content wholesale with main's version.

## Resolution rules (all file types)

1. The theme's visual identity is sacred. ALWAYS start from the theme version.
2. Port main's **logic** into the theme's **structure** — never the reverse.
3. If main rewrote a component's logic but not its look, use the theme's JSX/styling with main's updated logic.
4. If main added a completely new file that doesn't exist in the theme, take main's version — then **restyle it to match the theme's visual language** (colors, typography, spacing, component style, Tailwind classes). A new feature that looks like `main` in a themed store breaks the illusion. Check the theme's existing components for reference.
5. If main added a new UI component or section inside an existing file, port it in — but **adapt its styling to the theme**. Use the theme's color palette, font choices, border radii, spacing scale, and component patterns. Never drop in `main`'s default styling verbatim.
6. If main deleted something the theme still references, port the theme to whatever replaced it (see "When a file merged cleanly but fails"). Keep the theme's version only when main replaced it with nothing.
7. **Visual consistency is mandatory.** Every new feature, component, or UI element introduced by main MUST be adapted to the theme's design language before committing. This means matching the theme's color variables/palette, typography (font family, sizes, weights), spacing/padding scale, border radii, shadow styles, button styles, and Tailwind class patterns. Look at 2-3 existing theme components as reference. A feature that "looks like main" in a themed store is a bug.
8. After editing, verify NO conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) remain.
9. After editing, `git add` the file.
