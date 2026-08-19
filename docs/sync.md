# Syncing a store with the template

Store repos are seeded from a **snapshot** of `yournextstore`, then `git init`'d. They share
content with the template but no commits, so `git merge template/main` has no merge base and
degrades to "every file conflicts."

The fix is to **manufacture the missing base with `git replace --graft`, merge once, then delete
the graft**. The merge commit makes the lineage permanent — every later sync is a plain
`git fetch template && git merge template/main`.

## Procedure

```bash
git remote add template https://github.com/yournextstore/yournextstore.git
git fetch template
git branch backup/pre-template-merge          # cheap insurance; rebase-free escape hatch
```

**1. Find the fork point** — the template commit whose tree the store was seeded from. Don't guess
from dates; measure. The right commit has a diff of ~0 files against the store's root commit:

```bash
SEED=$(git rev-list --max-parents=0 HEAD)      # store's root commit
for c in $(git log --format=%H --since=<seed-date-minus-2w> --until=<seed-date-plus-1w> template/main); do
  echo "$(git diff --name-only "$SEED" "$c" | wc -l) $c"
done | sort -n | head -5
```

**2. Graft it in** as the store root's parent, so the two histories get a real base:

```bash
git replace --graft "$SEED" <fork-point>
git merge-base HEAD template/main              # must now print <fork-point>, not fail
```

**3. Merge and resolve:**

```bash
git merge template/main
```

**4. Drop the graft** once the merge commit exists — the lineage is now recorded in real history:

```bash
git replace -d "$SEED"
git merge-base HEAD template/main              # resolves through the merge commit; graft no longer needed
```

## Why merge, not rebase

Measured on a real tenant store (15 store commits, 31 template commits to absorb):

| | conflict stops | cumulative conflicted files |
|---|---|---|
| **merge** | 1 | 27 |
| **rebase** | 12 | 56 |

- **Conflicts recur under rebase.** Each store commit replays against a tree that moved underneath
  it, so the same semantic conflict is re-litigated in every commit that touched those files. One
  i18n commit alone stopped with 16 conflicted files.
- **Rename detection.** A merge diffs whole trees, so template renames carry store edits across
  automatically (in the run above, a store-localized `category-pagination.tsx` landed intact in the
  template's renamed `components/listing-pagination.tsx`). Rebase applies per-commit patches, where
  rename detection is far weaker — that work would have conflicted or been silently dropped.
- **Store `main` is published.** Rebase rewrites it and needs a force-push, and
  `bun run publish:store` deploys **remote** `main`. That alone disqualifies it.
- **Merge states the truth.** A store is a fork with its own identity, not a patch series on top of
  the template. Rebase asserts the latter.

Cost of merging: non-linear history, and the store's log now interleaves the template's commits. Use
`git log --first-parent` to see only store work.

Rebase is the better call only for a short-lived, unpushed branch, or a store that deliberately
stays a thin customization layer you intend to replay onto each template release.

## Resolving

Prefer `git checkout --ours <file>` / `--theirs <file>` for whole files, and resolve mixed files
hunk by hunk — don't blanket-pick a side. The decisions that recur:

- **Store wins** on brand tokens (`app/globals.css`), copy, `app/layout.tsx` chrome, and any
  component the store has repurposed. `components/yns-link.tsx` is the classic trap: the template
  treats it as a thin wrapper, some stores have made it the locale router. Read it before picking.
- **Template wins** on `proxy.ts`, `instrumentation-client.ts`, `lib/track.tsx` (platform-managed —
  the platform restores its own version on every save anyway), `components/ui/*`, and SDK call-site
  updates.
- **`package.json`**: union the two with `jq`, then prune deps orphaned by the merge.
  ```bash
  git show :2:package.json > ours.json && git show :3:package.json > theirs.json
  jq -s '.[0] * {dependencies: (.[1].dependencies + .[0].dependencies), scripts: (.[0].scripts + .[1].scripts)}' \
     ours.json theirs.json > package.json && rm ours.json theirs.json
  ```
- **`next.config.ts`**: template hardening can regress a store. `images.remotePatterns` is the one
  to check — a store serving media from a migrated CDN needs its host added back explicitly.

## Validate before pushing

Beyond `bun run check` and `bun run build`, confirm the prerendered shell survived the layout merge:

```bash
grep -c '<header' .next/server/app/index.html    # must be >= 1
```

Then smoke the routes the merge touched (`/`, `/products`, `/search`, any locale prefix) and confirm
no `git replace` entries remain: `git replace -l` prints nothing.
