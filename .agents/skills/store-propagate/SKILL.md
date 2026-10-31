---
name: store-propagate
description: Push the template's three platform-managed files (proxy.ts, lib/track.tsx, instrumentation-client.ts) to the store repos (yns-store-* in the tenants orgs). Publishing restores those files from each store's own main, so a commit there is the only way a change to them reaches existing stores. Use for "propagate proxy.ts", "update the managed files in every store", "roll out a proxy change", after landing a template change to one of those files. Every other template change reaches a store through the Upgrade button (the platform's upgrade-storefront skill), not this skill. Takes an optional list of store subdomains; defaults to every builder store.
---

# Push the platform-managed files to store repos

You may be running across many repos. Do not ask questions: decide, act and report. If one store
fails, record it and move on to the next.

## What this is for, and what it isn't

- Three files in every store are platform-managed: `proxy.ts`, `lib/track.tsx` and
  `instrumentation-client.ts` (the platform's `MANAGED_STOREFRONT_PATHS`). Every publish puts them
  back to the store repo's own `main`, so neither Elliot nor the Upgrade button can change them. A
  commit on the store's `main` is the only way, and this skill makes it.
- Every other template change reaches a store through the **Upgrade** button in Design: Elliot's
  `upgrade-storefront` skill in the platform repo (`agent/skills/upgrade-storefront`). It brings
  the changes in file by file, keeps the store's look and records the template commit in
  `.yns/template.json`. Don't copy other files from here, and never merge or rebase a store onto
  the template (README, "Updating a store to the template").

## Facts

- Store repos are `yns-store-<subdomain>` in **`yns-cx-tenants`** (staging, yns.cx) or
  **`yns-store-tenants`** (production, yns.store). Use `gh`.
- They share no history with the template: a new store is a copy made with GitHub's "create from
  template" (the platform's `src/lib/store/tenant-project.ts`).
- Pushing to a store's `main` redeploys that storefront. It is safe for open Design sessions: their
  catch-up moves onto the new `main` and keeps the edits they haven't published.
- `.env*` files are per-store secrets. Never read, change or commit them.

## Inputs

- Optional: store subdomains (e.g. `base celeste`) and/or the org. Default: the staging org, every
  builder store.
- List builder stores from the platform DB when you can:
  `SELECT subdomain FROM stores WHERE builder_config IS NOT NULL;`. Otherwise
  `gh repo list <org> --limit 200 --json name` and strip the `yns-store-` prefix.

## Per store

1. Clone into a temp dir: `gh repo clone <org>/yns-store-<subdomain> <tmp> -- --depth=1`.
2. Copy the three files from this repo's `origin/main` over the store's copies. A store that lacks
   one gets it.
3. Nothing differs: skip the store and report it as `current`.
4. `bun install`, `bun next typegen`, then `bun tsc --noEmit`. A failure means **don't push**:
   report the store with the error. It usually means the store's own code and the new file
   disagree, and that store needs the Upgrade button first.
5. Commit as `chore: update the platform-managed files to template <short sha>`, with a body
   naming the files that changed and the driving issue if you were given one. Plain push to
   `main`, **never force**.

## Fleet and report

Run a few stores at a time, each in its own temp dir: every push redeploys a store. End with one
table: store · files changed · pushed, current or error.

## Live spot-check (optional, when the invoker names expectations)

After the redeploy, check what the change promises with
`curl -sI https://<subdomain>.<yns.cx|yns.store><path>` (e.g. a newly forwarded path now answering
from the platform instead of the storefront's 404). Tenant 404s stream with HTTP 200: check content
or headers, not only the status code.
