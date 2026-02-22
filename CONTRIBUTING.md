# Contributing to Your Next Store

## Getting Started

```bash
git clone https://github.com/yournextstore/yournextstore.git
cd yournextstore
bun install
cp .env.example .env.local   # then add your YNS_API_KEY from yns.app/admin
bun dev
```

You need [Bun 1.0+](https://bun.sh/) and a YNS API key from [yns.app/admin](https://yns.app/admin).

## Project Structure

This is a [Next.js App Router](https://nextjs.org/docs) project. If you're unfamiliar with App Router, Server Components, or Server Actions, start with the [Next.js docs](https://nextjs.org/docs).

What's YNS-specific:

- **`lib/commerce.ts`** — Commerce Kit SDK client. All product/cart/checkout data goes through `commerce.productBrowse()`, `commerce.cartUpsert()`, etc.
- **`lib/money.ts`** — `formatMoney()` for all price formatting
- **`components/ui/`** — Shadcn UI primitives (Radix-based). Don't edit these directly — regenerate with `bunx shadcn@latest`
- **Error handling** — use `safe-try`: `const [error, result] = await safe(...)`
- **No `/api` routes** — mutations use Server Actions

## Coding Conventions

[Biome](https://biomejs.dev/) enforces most of these. Run `bun run lint` before pushing.

- Named exports only (except `page.tsx`, `layout.tsx`, etc.)
- Static typing without `any`
- `map`/`filter`/`reduce` over imperative loops
- `formatMoney()` for prices, `safe-try` for errors

## Before Submitting a PR

```bash
tsgo --noEmit     # No type errors
bun run lint      # No lint errors
bun test          # Tests pass
bun run build     # Build succeeds
```

Fork the repo, create a branch from `main`, and open a PR with a clear description of what changed and why.

### Good First Issues

Look for issues labeled [`good first issue`](https://github.com/yournextstore/yournextstore/labels/good%20first%20issue).

## Questions?

[GitHub Discussions](https://github.com/yournextstore/yournextstore/discussions) or [Discord](https://yournextstore.com/discord).
