---
name: theme-rebase
description: Rebase all theme-* branches onto main, resolving conflicts while preserving each theme's visual identity. Force-pushes directly to theme branches with backup tags. Run as a scheduled task or one-off.
---

# Rebase All Theme Branches onto Main

You are running autonomously as a scheduled task. Do not ask questions or wait for input — make decisions and proceed. If something fails, handle it and move on to the next theme.

## Context

This repository (`yournextstore/yournextstore`) has a `main` branch (the default template) and multiple `theme-*` branches that are visual variants. Theme branches have their own colors, layouts, hero sections, typography, and copy — but share the same underlying logic, SDK, components, and infrastructure as `main`.

Your job: rebase every theme branch onto the latest `main` so themes pick up infrastructure improvements, bug fixes, SDK updates, and dependency bumps — while preserving each theme's visual identity completely.

## Step 1: Discover theme branches

```
git fetch origin
```

List all remote theme branches:
```
git branch -r | grep 'origin/theme-' | sed 's|origin/||' | xargs
```

Process every theme branch found. Track results as you go — you will need them for the summary at the end.

## Step 2: For each theme branch

For each `THEME_BRANCH` (e.g., `theme-016`), do the following. If one theme fails, abort that theme's rebase, record the failure, and continue to the next theme. Never let one failure stop the entire run.

Set `REBASE_BRANCH` = `${THEME_BRANCH}-rebase`.

### 2a: Check if rebase is needed

```
git rev-list --count origin/${THEME_BRANCH}..origin/main
```

If the count is 0, the theme is already up to date. Log it and move to the next theme.

### 2b: Create backup tag and rebase branch

Create a backup tag so the old state can be recovered if anything goes wrong:
```
git tag backup/${THEME_BRANCH}/$(date +%Y-%m-%d) origin/${THEME_BRANCH}
git push origin backup/${THEME_BRANCH}/$(date +%Y-%m-%d)
```

Then create the working branch:
```
git checkout -B ${REBASE_BRANCH} origin/${THEME_BRANCH}
```

### 2c: Attempt rebase

```
git rebase origin/main
```

If this succeeds cleanly (exit code 0), skip to step 2e.

### 2d: Resolve conflicts

When conflicts occur, resolve them iteratively. For each round:

1. Find conflicted files: `git diff --name-only --diff-filter=U`
2. If none remain, the round is done.
3. Resolve each conflicted file (see [rules.md](rules.md)).
4. Run `GIT_EDITOR=true git rebase --continue`.
5. If more conflicts appear in the next commit, repeat.
6. Maximum 50 iterations. If exceeded, abort this theme.

For each conflicted file: read the file contents, resolve ALL conflict markers by editing the file to produce a clean result, then `git add` the file.

[rules.md](rules.md) says which side of a conflict marker is which, the order to resolve files in, and what to keep from each side, by file type.

### 2e: Post-rebase cleanup

1. Regenerate bun.lock:
   ```
   bun install
   ```
2. If bun.lock changed or is untracked:
   ```
   git add bun.lock
   git commit -m "chore: regenerate bun.lock after rebase"
   ```

### 2f: Validate

```
bunx biome check
```

If biome reports auto-fixable issues:
```
bunx biome check --write
git add -A
git commit -m "chore: fix lint issues after rebase"
```

If there are unfixable errors, attempt to fix them (max 2 attempts). If still broken, note them in the summary and continue — do not block on lint.

Then run the type check and the tests:

```
bun tsc --noEmit && bun test
```

A `tsc` failure is almost always a half-ported resolution (a `YnsLink` import that survived, props passed to a component whose signature main changed) — fix it, `git add -A`, and amend or commit `chore: fix types after rebase`.

`app/palette.test.ts` asserts the theme's own `app/globals.css` clears WCAG AA (4.5:1) for each text/surface token pair. It reports the failing pair and the ratio. Fix it in the theme's CSS — that file is the theme's to change, so this is in bounds — by moving the **text** token's lightness away from its surface's in steps of 0.02 — darker on a light surface, lighter on a dark one such as `.dark` — keeping chroma and hue untouched (on a light surface: `--muted-foreground: oklch(0.556 0.02 250)` → `oklch(0.536 0.02 250)` → …), re-running `bun test app/palette.test.ts` after each step until it passes. Never move the surface/tint token: the tint is the theme's identity, the text token is what has to clear AA on it. Record the final value in the summary.

Finally, when `YNS_API_KEY` is available in the environment:

```
bun run build
```

This is `next build` plus `scripts/check-shell.sh`, which fails if the theme's chrome is not in the prerendered shell — the check that catches a half-ported `app/layout.tsx` or a surviving `usePathname()` in the nav. Its failure message names the three usual causes; fix and re-run (max 2 attempts). Without an API key the build cannot run at all: record "shell check not run" for that theme in the summary rather than pushing a silent regression as verified.

The build also fails when anything on `/about`, `/faq`, `/contact` or `/blog` renders per request, the theme's root layout included: those pages export `ensureStatic = "navigation"` (AGENTS.md, "Fully static routes"). A `<Suspense>` does not satisfy it. Move a theme's own cookie or header read into the browser the way main reads the cart; a page that genuinely needs per-request data drops its `ensureStatic` line instead, and the summary says so.

### 2g: Push directly to theme branch

Force-push the rebased branch directly to the theme branch (backup tag was created in step 2b):

```
git push --force-with-lease origin ${REBASE_BRANCH}:${THEME_BRANCH}
```

### 2h: Handle failure for this theme

If the rebase cannot be completed for this theme:

1. `git rebase --abort`
2. Create a GitHub issue:
   ```
   gh issue create \
     --title "Rebase failed: ${THEME_BRANCH}" \
     --body "<explanation of what failed and why>" \
     --label "rebase-failed"
   ```
3. Record the failure and move on to the next theme.

## Step 3: Summary

After processing all themes, output a summary table:

| Theme | Status | Conflicts Resolved | Notes |
|-------|--------|-------------------|-------|
| theme-006 | success | 3 files | — |
| theme-016 | up to date | — | — |
| theme-099 | failed | — | bun install failed |

Use the Notes column for what a human has to know afterwards: a text token the palette test forced you to change, and "shell check not run" for any theme built without a `YNS_API_KEY`.

## Rules

- This runs autonomously. Never ask questions. Make your best judgment and proceed.
- Never modify the `main` branch. Only create/push `*-rebase` branches and force-push to theme branches.
- Always create a backup tag before force-pushing to a theme branch.
- Always use `--force-with-lease` (not `--force`) when pushing.
- If `bun install` fails for a theme, that theme is a blocker — abort it and move on.
- Always clean up git state (`git rebase --abort`, `git checkout main`) before moving to the next theme so you don't carry dirty state forward.
- Between themes, run `git checkout main` to reset to a clean state.
- Delete the local `*-rebase` branch after pushing to keep git state clean.
