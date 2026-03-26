---
name: rebase-themes
description: Rebase all theme-* branches onto main, resolving conflicts while preserving each theme's visual identity. Creates PRs for each theme. Run as a scheduled task or one-off.
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

For each `THEME_BRANCH` (e.g., `theme-cosmetics`), do the following. If one theme fails, abort that theme's rebase, record the failure, and continue to the next theme. Never let one failure stop the entire run.

Set `REBASE_BRANCH` = `${THEME_BRANCH}-rebase`.

### 2a: Check if rebase is needed

```
git log origin/main --not origin/${THEME_BRANCH} --oneline | head -1
```

If there are no new commits on main that aren't in the theme branch, skip it — it's already up to date. Log it and move to the next theme.

### 2b: Create rebase branch

```
git checkout origin/${THEME_BRANCH}
git checkout -B ${REBASE_BRANCH}
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
3. Resolve each conflicted file (see strategy below).
4. Run `GIT_EDITOR=true git rebase --continue`.
5. If more conflicts appear in the next commit, repeat.
6. Maximum 50 iterations. If exceeded, abort this theme.

For each conflicted file: read the file contents, resolve ALL conflict markers by editing the file to produce a clean result, then `git add` the file.

**CRITICAL — during `git rebase main`, conflict marker sides are SWAPPED vs a normal merge:**
- `<<<<<<< HEAD` / "ours" = **MAIN** (logic updates, SDK changes, bug fixes, deps)
- `>>>>>>> ...` / "theirs" = **THEME** (visual design, JSX, components, classNames, styling)

**Resolve conflicted files in this order:** `package.json` first (so bun.lock can regenerate), then `bun.lock` (just regenerate, never manually resolve), then everything else.

#### Conflict resolution strategies by file type

**CSS files (`*.css`)**
ALWAYS prefer the theme branch (theirs). Keep all theme colors, fonts, spacing, variables, and visual styling. Only add new CSS rules or variables from main (ours) that don't exist in the theme. Never replace or remove theme-specific styles.

**React/JSX files (`*.tsx`, `*.jsx`)**
START from the theme branch (theirs) code — copy it as-is. Then carefully port logic changes from main (ours) INTO the theme code: updated hooks, state, event handlers, data fetching, SDK/API calls, utility functions, types, and imports. Keep the theme's JSX structure, components, className attributes, Tailwind classes, styling, and layout UNCHANGED. The final file must LOOK like the theme but have main's updated logic. NEVER start from main's code and restyle it — always start from theme and add main's logic into it. **If main introduces entirely new JSX elements, sections, or components that don't exist in the theme yet, you MUST restyle them to match the theme** — use the theme's color palette, typography, Tailwind class conventions, spacing, and component patterns. Study 2-3 nearby theme components as a reference for the correct visual style.

**`package.json`**
Merge both: use main's (ours) dependency versions for shared packages, but keep any theme-only additions from the theme (theirs). Ensure valid JSON. After resolving, run `bun install` and `git add bun.lock`.

**`bun.lock`**
Never resolve manually. Run `bun install` to regenerate, then `git add bun.lock`.

**`next.config.ts` / `next.config.mjs` / `next.config.js`**
Keep the theme's (theirs) config as the base. Only add new config options from main (ours) that don't already exist in the theme. Preserve all theme-specific entries (remotePatterns, image domains, rewrites).

**Tailwind config files**
ALWAYS prefer the theme branch (theirs). Keep all theme customizations, colors, fonts, extensions. Only add new utilities or plugins from main (ours) that don't conflict.

**All other files**
Start from the theme branch (theirs) code. Port logic fixes, type fixes, SDK changes, and bug fixes from main (ours) into the theme code. Never replace theme content wholesale with main's version.

#### Resolution rules (all file types)

1. The theme's visual identity is sacred. ALWAYS start from the theme version.
2. Port main's **logic** into the theme's **structure** — never the reverse.
3. If main rewrote a component's logic but not its look, use the theme's JSX/styling with main's updated logic.
4. If main added a completely new file that doesn't exist in the theme, take main's version — then **restyle it to match the theme's visual language** (colors, typography, spacing, component style, Tailwind classes). A new feature that looks like `main` in a themed store breaks the illusion. Check the theme's existing components for reference.
5. If main added a new UI component or section inside an existing file, port it in — but **adapt its styling to the theme**. Use the theme's color palette, font choices, border radii, spacing scale, and component patterns. Never drop in `main`'s default styling verbatim.
6. If main deleted something the theme still references, keep the theme's version.
7. **Visual consistency is mandatory.** Every new feature, component, or UI element introduced by main MUST be adapted to the theme's design language before committing. This means matching the theme's color variables/palette, typography (font family, sizes, weights), spacing/padding scale, border radii, shadow styles, button styles, and Tailwind class patterns. Look at 2-3 existing theme components as reference. A feature that "looks like main" in a themed store is a bug.
8. After editing, verify NO conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`) remain.
9. After editing, `git add` the file.

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

If there are unfixable errors, attempt to fix them (max 2 attempts). If still broken, note them in the PR body and continue — do not block on lint.

### 2g: Push and create/update PR

```
git push --force-with-lease origin ${REBASE_BRANCH}
```

Check for existing PR:
```
gh pr list --head ${REBASE_BRANCH} --base ${THEME_BRANCH} --json number --jq '.[0].number'
```

**If PR exists**, update it with `gh pr edit`. **If not**, create one with `gh pr create`.

Title: `chore: rebase ${THEME_BRANCH} onto main`

Body (fill in the actual details from your work):
```
Automated rebase of `${THEME_BRANCH}` onto `main`.

## Summary
- Commits from main applied: <count>
- Conflicts resolved automatically using Claude Code
- `bun.lock` regenerated after rebase
- Lint checked and auto-fixed where possible

## Files with conflicts resolved
- `<file>`: <brief description of what you did>
- ...

## Notes
<any issues, unfixable lint errors, or things needing human attention — or "None">
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

| Theme | Status | PR | Conflicts Resolved | Notes |
|-------|--------|----|--------------------|-------|
| theme-cosmetics | success | #42 | 3 files | — |
| theme-sneakers | up to date | — | — | — |
| theme-cbd | failed | — | — | bun install failed |

## Rules

- This runs autonomously. Never ask questions. Make your best judgment and proceed.
- Never modify the `main` branch. Only create/push `*-rebase` branches.
- PRs target the theme branch, not main.
- Always use `--force-with-lease` (not `--force`) when pushing.
- If `bun install` fails for a theme, that theme is a blocker — abort it and move on.
- Always clean up git state (`git rebase --abort`, `git checkout main`) before moving to the next theme so you don't carry dirty state forward.
- Between themes, run `git checkout main` to reset to a clean state.
