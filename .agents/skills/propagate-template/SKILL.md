---
name: propagate-template
description: Propagate the template's current main into forked AI-store repos (yns-store-* in the tenants org), updating every file the store never customized and reporting the rest. Content-level reconcile — store repos share NO git history with the template. Use for "template rebase", "propagate template", "sync store repos", after landing template changes that existing stores must pick up. Takes an optional list of store subdomains; defaults to every builder store.
---

# Propagate template main into forked store repos

You may be running autonomously across many repos. Do not ask questions — decide, act, and
report. If one store fails, record it and move on to the next.

## Architecture facts (do not rediscover these)

- Store repos are `yns-store-<subdomain>` in the GitHub org **`yns-cx-tenants`** (staging /
  yns.cx) or **`yns-store-tenants`** (production / yns.store). Access via `gh`.
- **Store repos share no git history with this template.** Provisioning copies template files
  into a fresh repo without upstream parents (see the platform's
  `src/lib/sandbox/fork-builder.ts`). Never attempt `git rebase`/`git merge` against the
  template — this skill reconciles *content*, file by file.
- Stores may have been seeded from a `theme-*` branch, and Elliot edits files freely
  afterwards. The only files Elliot cannot touch are the **managed paths**
  (`proxy.ts`, `lib/track.tsx`, `instrumentation-client.ts` — the platform's
  `MANAGED_STOREFRONT_PATHS`): the platform's commit script restores those from the store
  repo's own `origin/main` on every save, so *landing the template's version on the store's
  main IS the propagation mechanism* for them.
- Pushing to a store repo's `main` triggers a production redeploy of that tenant storefront,
  and it is safe with respect to live builder sandboxes: their save script fetches and
  rebases onto `FETCH_HEAD`, aborting cleanly on conflict.
- `.env*` files are per-store secrets. Never read, modify, or commit them.

## Inputs

- Optional: a list of store subdomains (e.g. `base celeste`) and/or the org to target.
  Default: staging org, all builder stores.
- Enumerate builder stores from the platform DB when available (source of truth):
  `SELECT subdomain FROM stores WHERE builder_config IS NOT NULL;` — otherwise
  `gh repo list <org> --limit 200 --json name` and strip the `yns-store-` prefix.

## Per-store algorithm

Work from a checkout of this template repo with full history and all branches fetched
(`git fetch origin "+refs/heads/*:refs/remotes/origin/*"`). Clone each store repo into a
temp dir (`gh repo clone <org>/yns-store-<subdomain> <tmp> -- --depth=1`).

The decision rule for every path is **"has the store ever customized this file?"**, answered
by blob-hash comparison against the template `origin/main` history:

```
# all historical blob hashes of a path on template main (cache per path):
git -C <template> log origin/main --format=%H -- <path> \
  | while read sha; do git -C <template> rev-parse -q --verify "$sha:<path>"; done | sort -u
# the store's current blob:
git -C <store> hash-object <path>
```

Matching only a `theme-*` blob (not any main-history blob) counts as **customized** — theme
identity must never be flattened onto main's look.

Then, per path:

1. **Managed paths** (`proxy.ts`, `lib/track.tsx`, `instrumentation-client.ts`): overwrite
   with template main's version unconditionally.
2. **Path exists in template main** and the store's copy differs: if the store blob matches
   some main-history blob → replace with template main's version. Otherwise → leave it,
   record as `skipped (customized)`.
3. **Path exists in the store but not in template main** (template deleted it): if the store
   blob matches some main-history blob → delete it. Otherwise → leave, record as
   `skipped (customized, template deleted)`.
4. **Store-created paths** (never existed on template main): untouched, not reported.
5. **Special cases** — never blanket-copied:
   - `package.json`: reconcile dependencies with `jq` — for every key in the template's
     `dependencies`/`devDependencies`, set the template's version; drop store keys absent
     from template main whose version spec matches some main-history spec (i.e. the template
     removed them); keep store-added deps. Leave `scripts` and the rest to the same
     rule-2/rule-3 judgement at the whole-file level only if the file was never customized.
   - `bun.lock`: never copied — regenerate with `bun install` after the reconcile.
   - `.env*`, `deploy_key.pem`: never touched.

## Verify, commit, push

In each store repo, in order — a failure at any step means **do not push**; report instead:

1. `bun install`
2. `bun next typegen` (regenerates the route-type globals; deleted routes otherwise leave
   stale validators)
3. `bun tsc --noEmit`
4. `bun run lint` if the script exists (biome, auto-fix mode is fine)

Commit everything applied as one commit — subject
`chore: propagate template <short-sha of template main>`, body listing counts
(updated/deleted/skipped) and the driving issue refs if the invoker supplied them. Plain
push to `main`, **never force**. Remember each push redeploys that tenant — when running
across a fleet, process a handful at a time rather than pushing dozens simultaneously.

## Scale + report

One store = one agent task; run a few in parallel, each in its own temp dir. At the end,
produce a single table: store · updated · deleted · skipped(customized) · pushed?/error.
Anything `skipped (customized)` for a file the invoker's change actually needs (e.g. an
edit inside a customized `app/layout.tsx`) belongs in a "needs manual follow-up" list with
the store name and path — do not attempt semantic merges of customized files unless the
invoker explicitly described the targeted edit to make (e.g. "remove the `AuthButton`
import and its render line if present").

## Live spot-check (optional, when the invoker names expectations)

After a store's push + redeploy, `curl -sI https://<subdomain>.<yns.cx|yns.store><path>`
against whatever the propagated change promises (e.g. a proxied path now answering with a
platform redirect instead of the template 404). Remember tenant 404s stream with HTTP 200 —
check content or headers, not just the status code.
