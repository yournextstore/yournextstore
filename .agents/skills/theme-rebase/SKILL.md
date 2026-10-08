---
name: theme-rebase
description: Rebase all theme-* branches onto main, one commit per theme, preserving each theme's visual identity. A script does the mechanics and a headless agent resolves only what needs judgment; pushes with backup tags. Run as a scheduled task or one-off.
---

# Rebase theme branches onto main

Each `theme-*` branch is one commit on top of `main`: the theme's own `theme NNN: …` commit (README, "Themes"). [`theme-rebase.sh`](theme-rebase.sh) rebuilds every theme that way on the current `main`. For each theme, in its own worktree, it:

1. squash-merges the theme onto `main`: one 3-way merge, however many commits the branch has;
2. settles what needs no judgment: `bun.lock`, `package.json`, and every path only copied commits touched, which take main's side;
3. starts one headless Claude session for what is left, with [rules.md](rules.md) as its instructions;
4. runs `bun run check` and `bun run build`, resuming the session once on a failure;
5. commits with the theme commit's message and author, and sends anything doubtful to review.

Nothing leaves the machine until `push`.

## Run it

```bash
S=.agents/skills/theme-rebase/theme-rebase.sh
bash $S run theme-002 theme-003   # or --all
bash $S push                      # the last run's ok themes, one at a time
bash $S clean                     # drop leftover worktrees and theme-rebase/* branches
```

| Setting | Default | |
|---|---|---|
| `JOBS` | 3 | themes in parallel |
| `AGENT` | `claude` | `none`: stop at `needs-agent` instead of starting a session |
| `BUILD` | 1 | 0 skips `bun run build` |
| `AGENT_BUDGET` | 10 | USD cap per agent session |
| `AGENT_MODEL` | `claude-sonnet-5-5` | `claude-opus-5-5` for a theme Sonnet got wrong |

The build reads live store data, so it needs `YNS_API_KEY` in `.env`. A free census of what a run would hit: `AGENT=none BUILD=0 bash $S run --all`.

Roll a large run out in batches of about 20: run, read the table, push, then the next batch. A scheduled run is `run --all`, then `push`, then the table as the report.

## Statuses

| Status | Meaning | Next |
|---|---|---|
| `up-to-date` | already on top of `main` | — |
| `ok` | resolved, checked, built and committed | `push` |
| `review` | built, but a file the theme customized now equals main's, a test, script or config file changed, or an `ensureStatic` line is gone | look at the flagged paths and the pages in a browser in the kept worktree, then `push <theme>` |
| `failed` | conflicts left, or check or build still failing | finish in the kept worktree, with `claude -r <session>` or by hand following [rules.md](rules.md); commit with `git commit --no-verify -C <themeCommit>`, then `push <theme>` |
| `needs-agent` | `AGENT=none` and the rules couldn't settle everything | re-run with the agent |
| `unbuilt` | `BUILD=0` or no `YNS_API_KEY`, so never built; `push` skips it | re-run with the build |
| `stale` | someone pushed to the theme during the run | re-run |
| `pushed` | on GitHub, with a `backup/<theme>/<date>-<sha>` tag at the old tip | — |

`results.jsonl` in the run directory (printed under the table) holds every row: the session id, the theme commit, the conflicts by kind and the kept worktree.

## Policy

- A theme's own commits have a `theme NNN: …` subject. Every other commit on a theme branch counts as a copy of a `main` change, and wherever it conflicts, main's side wins. Make cross-cutting fixes on `main`, never on theme branches.
- Never modify `main` from this skill. `push` writes only `theme-*` branches and `backup/*` tags, atomically, leased on the tip the run started from.
- Each theme push starts a Vercel preview build, which is why `push` goes one theme at a time.
- Local `theme-*` branches go stale after a push: delete them, or reset them to `origin/<theme>`.
