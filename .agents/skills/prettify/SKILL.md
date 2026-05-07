---
name: prettify
description: Iteratively improves the visual design of an existing page — making it more sophisticated, richer, and prettier — without redesigning from scratch. Works on any page or UI surface: landing pages, marketing pages, pricing, docs, dashboards, admin views, settings, modals, empty states, etc. Use when the user says "prettify", or that a page/screen/component "looks flat", "feels generic", "needs more polish", "make it prettier", "more sophisticated", "richer", or asks to improve, refine, or enhance an existing UI surface. Loops screenshot → critique → targeted edit → re-screenshot until it meets a higher visual bar.
---

# Prettify

Improve the visual quality of an **existing** UI surface through small, targeted iterations. Works on any page or component: landing/marketing, pricing, docs, dashboards, admin tables, settings panels, modals, empty states, etc. Preserve the existing structure, copy, and brand. Do not redesign.

## Inputs

The user gives you a target — a route (e.g. `/`, `/pricing`, `/admin/products`), a component file, a running URL, or a specific section/modal/state of a page. If unclear, ask once:
- Which surface? (route, file path, or component)
- For component-level targets: what state/route exposes it? (e.g. "the empty state on `/admin/orders` when there are no orders")
- What feels off? (optional — gives you a starting hypothesis)
- How many iterations? (default 5; user can request more)

If the dev server isn't running, start it (`bun dev`) before iterating. For authed surfaces (admin, settings), make sure you're signed in before screenshotting.

## The Loop

Run this loop N times. Each pass should make **one focused improvement**, not a sweeping rewrite.

### 1. Screenshot the current state

Use Chrome DevTools MCP. Capture at all three required widths (mobile-first is mandatory for YNS):

- 320px (mobile)
- 768px (tablet)
- 1280px (desktop)

Save screenshots so you can compare before/after across iterations.

### 2. Critique against the rubric

Score the current state across these dimensions. Focus the next change on the **lowest-scoring** one — don't try to fix everything at once.

| Dimension | What to look for |
|-----------|------------------|
| **Visual hierarchy** | Does the eye know where to land first? Is the primary heading/action dominant? Are CTAs obvious without being loud? On data-heavy surfaces: is the most important column/value emphasized? |
| **Typography** | Type scale ratio (1.25–1.5×). Heading weight contrast vs body. Tracking on display sizes. Line-height on body (~1.5). Tabular numerals on numeric tables. |
| **Spacing & rhythm** | Vertical rhythm between sections/rows/cards. Generous breathing room around primary content. Consistent spacing scale (Tailwind 4/6/8/12/16/24). No cramped edges on mobile. |
| **Color & contrast** | Is the palette doing work? Accent color used sparingly for emphasis (status, focus, primary action). Neutrals layered (not just white + black). Sufficient contrast (WCAG AA). |
| **Depth & texture** | Subtle shadows, borders, gradients, noise, or backdrop blur where appropriate. Avoid flat-everywhere or shadow-everywhere. |
| **Detail & richness** | Micro-details that signal craft: refined dividers, subtle animations, considered iconography, well-tuned focus rings, balanced asymmetry, considered empty/loading states. |
| **Consistency** | Border radii, shadow tokens, button styles, table cell padding, form field heights all aligned. No one-off styles. |
| **Mobile fidelity** | Mobile is not a shrunken desktop. Adjusted type sizes, stacked layouts, full-bleed sections, scrollable tables with sticky headers where appropriate. |

### 3. Apply ONE targeted improvement

Pick the single highest-leverage change for this iteration. Examples of *good* targeted changes:

**Marketing / landing surfaces:**
- "Increase H1 from `text-4xl md:text-6xl` to `text-5xl md:text-7xl`, tighten tracking to `-0.02em`."
- "Add a subtle gradient backdrop behind the hero (`bg-gradient-to-b from-white via-zinc-50 to-white`)."
- "Replace solid border on feature cards with `border border-zinc-200/60 shadow-[0_1px_2px_rgba(0,0,0,0.04)]`."
- "Bump section padding from `py-16` to `py-24 md:py-32` for more breathing room."

**App / admin / dashboard surfaces:**
- "Apply `tabular-nums` and right-align numeric columns; soften header row to `text-zinc-500 uppercase text-xs tracking-wider`."
- "Tighten table row padding (`py-3` → `py-2.5`) and add `divide-y divide-zinc-100` for a calmer rhythm."
- "Replace heavy card shadow with a hairline border + 1px shadow combo (`border border-zinc-200/70 shadow-[0_1px_0_rgba(0,0,0,0.02)]`)."
- "Add `focus-visible:ring-2 ring-zinc-900/10 ring-offset-2` to interactive rows for a more refined focus state."

**Component-level (modals, empty states, forms):**
- "Increase modal max-width and inner padding; make the title heavier and add a subtle muted subtitle."
- "Replace the empty-state stock illustration with a refined icon, soften the helper text, lift the primary CTA."
- "Align form field heights, increase label tracking, and unify input border to a single token."

Examples of *bad* changes (these are redesigns, not enrichment):
- Replacing the hero / table / modal layout entirely.
- Swapping the brand color palette.
- Adding a new section, column, or step that wasn't there.
- Rewriting copy.
- Replacing a component library (e.g. ripping out shadcn primitives).

### 4. Verify the change

- Re-screenshot at all three widths.
- Compare side-by-side with the previous screenshot.
- If the change made it worse or didn't move the needle, **revert it**. Don't accumulate regressions.
- Run `bun lint` and `bun tsgo --noEmit` if you touched TypeScript.

### 5. Log the iteration

Keep a running log in your response:

```
Iteration 3/5
- Critique focus: typography hierarchy (H1 felt thin against the body copy)
- Change: H1 font-weight 600 → 700, tracking -0.01em → -0.02em
- Result: kept (clearer hierarchy, no regression at 320px)
```

If reverted, say so and try the next-priority dimension.

## Rules

- **Tabs for indentation, always** (per AGENTS.md). No spaces.
- **Mobile-first.** Every change must hold at 320px. If a change only works on desktop, it's a regression.
- **Never rewrite copy.** Visual changes only unless the user explicitly asks for copy edits.
- **Never restructure layout** (swap sections, change DOM order, replace components). Style and refine what's there.
- **Use existing tokens** — Tailwind classes, design system colors, `cn()` for class merging. Don't introduce raw hex codes if a token exists.
- **Use `YNSLink`, not `Link`** if you touch links.
- **Edit existing files**, don't create new components for cosmetic tweaks.
- **One change per iteration.** If you want to bundle "spacing + shadow", do them as iteration 4 and iteration 5.
- **Max iterations = what the user asked for.** Don't keep going past it. Stop, summarize, and ask if they want more.

## Anti-patterns to avoid

- **Shadow soup** — shadows on every card, every button, every section. Pick where depth matters.
- **Gradient everything** — one or two strategic gradients, not a gradient zoo.
- **Border-everything** — borders should be intentional, not decorative wrap.
- **Animation noise** — fade-in-on-scroll on every element is exhausting. Animate selectively.
- **AI-generic aesthetic** — purple-to-pink gradients, glassmorphism on white, generic stock-photo backgrounds. Aim for considered, not trendy.
- **Loud accents** — accent colors should highlight, not dominate. If three elements compete for attention, none win.

## Output format

After the loop completes, output a summary:

```
## Prettify summary — <surface>

Iterations run: 5
Changes kept: 4
Changes reverted: 1

### Changes
1. [kept] Hero H1 weight + tracking — stronger hierarchy
2. [kept] Section padding scale (py-16 → py-24 md:py-32) — more breathing room
3. [reverted] Gradient backdrop — competed with hero image
4. [kept] Feature card border refinement — softer, more considered
5. [kept] Footer accent divider — added subtle craft detail

### Files touched
- src/app/page.tsx
- src/ui/marketing/hero.tsx
- src/ui/marketing/feature-grid.tsx

### Screenshots
- before/ and after/ at 320, 768, 1280 — see <path>

### What I'd do next
<one or two suggestions for further iterations the user might want>
```

## When to stop early

- You've made 3 consecutive reverts in a row — your hypothesis is wrong, ask the user for direction.
- The user's stated complaint is resolved (e.g., "it felt flat" → has depth now). Don't keep adding for the sake of adding.
- The surface is hitting diminishing returns. Better to stop at a strong v2 than churn into a worse v3.
