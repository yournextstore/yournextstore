#!/usr/bin/env bash
# Rebase theme branches onto main. Each theme becomes main plus one commit: its
# own `theme NNN: …` commit, squash-merged onto a pinned main SHA. Conflicts
# that need no judgment are settled here; whatever is left goes to one headless
# Claude session per theme, with rules.md as its instructions. A theme passes
# `bun run check` and `bun run build` before it can be pushed. See SKILL.md.
#
# Usage: theme-rebase.sh run [theme… | --all]   rebase locally; never touches the remote
#        theme-rebase.sh push [theme…]          push the last run's ok themes, one at a time
#        theme-rebase.sh clean                  remove leftover worktrees and theme-rebase/* branches
#
#        JOBS=3                         themes processed in parallel
#        AGENT=claude | none            none: a theme that needs the agent stops at needs-agent
#        BUILD=1 | 0                    0 skips `bun run build`
#        AGENT_BUDGET=10                USD cap per agent session
#        AGENT_MODEL=claude-sonnet-5-5  model for the agent sessions

set -euo pipefail

SKILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SELF="$SKILL_DIR/$(basename "${BASH_SOURCE[0]}")"
ROOT="$(git -C "$SKILL_DIR" rev-parse --show-toplevel)"
# Runs, logs and worktrees, per checkout: `push` reads the latest run of this one.
STATE="${TMPDIR:-/tmp}"
STATE="${STATE%/}/yns-theme-rebase/$(basename "$ROOT")-$(printf '%s' "$ROOT" | shasum | cut -c1-8)"
mkdir -p "$STATE"
STATE="$(cd "$STATE" && pwd -P)"

JOBS="${JOBS:-3}"
AGENT="${AGENT:-claude}"
BUILD="${BUILD:-1}"
AGENT_BUDGET="${AGENT_BUDGET:-10}"
AGENT_MODEL="${AGENT_MODEL:-claude-sonnet-5-5}"

# husky: `bun install` would rewrite the shared .git/config, and commits would run lint-staged.
export HUSKY=0
# Route paths such as `app/product/[slug]/page.tsx` are file names, not globs.
export GIT_LITERAL_PATHSPECS=1

# rerere's cache is shared by every worktree, so a recorded resolution would make
# one theme's result depend on which theme ran first. No auto-gc mid-run either.
g() { git -c rerere.enabled=false -c gc.auto=0 "$@"; }

die() {
	printf 'theme-rebase: %s\n' "$1" >&2
	exit 1
}

usage() {
	sed -n '2,17p' "$SELF" | sed 's/^# \{0,1\}//' >&2
	exit 2
}

count() { printf '%s' "$1" | grep -c . || true; }

# --- run ---------------------------------------------------------------------

cmd_run() {
	command -v jq >/dev/null || die "jq is required."
	command -v bun >/dev/null || die "bun is required."
	[ "$AGENT" = none ] || command -v claude >/dev/null || die "claude is required (or set AGENT=none)."

	g -C "$ROOT" fetch --quiet --prune origin || die "could not fetch origin."

	local themes=() t
	if [ "${1:-}" = "--all" ]; then
		while IFS= read -r t; do
			themes+=("$t")
		done < <(git -C "$ROOT" for-each-ref --format='%(refname:lstrip=3)' 'refs/remotes/origin/theme-*')
	else
		themes=("$@")
	fi
	[ "${#themes[@]}" -gt 0 ] || usage

	MAIN="$(git -C "$ROOT" rev-parse origin/main)"
	RUN="$STATE/$(date +%Y%m%d-%H%M%S)"
	mkdir -p "$RUN/logs" "$RUN/wt"
	ln -sfn "$RUN" "$STATE/latest"
	export MAIN RUN ROOT SKILL_DIR AGENT BUILD AGENT_BUDGET AGENT_MODEL

	printf 'Rebasing %d theme(s) onto main %s, %s at a time. Logs: %s/logs\n\n' \
		"${#themes[@]}" "${MAIN:0:7}" "$JOBS" "$RUN"
	printf '%s\n' "${themes[@]}" | xargs -n 1 -P "$JOBS" "$BASH" "$SELF" one || true
	table "$RUN"
}

# One theme, in a child process started by xargs. Every path ends in `finish`.
cmd_one() {
	T="$1"
	BR="theme-rebase/$T"
	WT="$RUN/wt/$T"
	TPATHS="$RUN/logs/$T.tpaths"
	OLD='' NEW='' BASE='' THEME_COMMIT='' KEPT='' SESSION='' COST=0 AGENT_NOTE=''
	FROM_MAIN='' BY_RULE='' BY_AGENT='' REVIEW='' DONE=0
	exec 3>&1 >>"$RUN/logs/$T.log" 2>&1
	trap '[ "$DONE" = 1 ] || finish failed "stopped unexpectedly, see the log"' EXIT
	cd "$ROOT"

	OLD="$(git rev-parse -q --verify "origin/$T^{commit}")" || finish failed "no branch origin/$T"
	if git merge-base --is-ancestor "$MAIN" "$OLD"; then
		finish up-to-date
	fi
	BASE="$(git merge-base "$OLD" "$MAIN")"

	# The theme's own commits. Anything else on the branch is a copy of a main change.
	local commits c
	commits="$(git log --reverse --format='%H %s' "$BASE..$OLD" | grep -E '^[0-9a-f]+ theme [0-9]{3}:' | cut -d' ' -f1 || true)"
	[ -n "$commits" ] || finish failed "no 'theme NNN:' commit above main"
	THEME_COMMIT="$(head -n 1 <<<"$commits")"
	for c in $commits; do
		git diff-tree --no-commit-id --name-only -r "$c"
	done | sort -u >"$TPATHS"

	if git worktree list --porcelain | grep -qxF "branch refs/heads/$BR"; then
		finish failed "$BR is checked out from an earlier run: push it, or run clean"
	fi
	g worktree add -q -B "$BR" "$WT" "$MAIN" || finish failed "could not create the worktree"
	KEPT="$WT"
	local env
	for env in .env .env.local; do
		if [ -f "$ROOT/$env" ]; then ln -s "$ROOT/$env" "$WT/$env"; fi
	done
	cd "$WT"

	local rc=0
	g -c merge.conflictStyle=zdiff3 merge --squash "$OLD" || rc=$?
	[ "$rc" -le 1 ] || finish failed "git merge --squash failed (exit $rc)"

	local p
	while IFS= read -r p; do
		if [ "$p" = bun.lock ] || ! grep -qxF "$p" "$TPATHS"; then
			take_main "$p"
			FROM_MAIN="$FROM_MAIN$p"$'\n'
		elif [ "$p" = package.json ] && merge_package_json; then
			BY_RULE="${BY_RULE}package.json"$'\n'
		fi
	done < <(unmerged)

	BY_AGENT="$(unmerged)"
	if [ -n "$BY_AGENT" ]; then
		[ "$AGENT" != none ] || finish needs-agent
		agent "$(brief)"
		stage_resolved
		[ -z "$(unmerged)" ] || finish failed "the agent left unmerged paths"
		case "$(g diff --cached --check 2>&1 || true)" in
			*"leftover conflict marker"*) finish failed "conflict markers left in staged files" ;;
		esac
	fi

	bun install || finish failed "bun install failed"
	normalize
	if ! bun run check >"$RUN/logs/$T.check" 2>&1; then
		[ "$AGENT" != none ] || finish needs-agent "bun run check fails"
		agent "$(failure_prompt "bun run check" "$RUN/logs/$T.check")"
		stage_resolved
		normalize
		bun run check >"$RUN/logs/$T.check" 2>&1 || finish failed "bun run check still fails"
	fi

	# An unbuilt theme is committed but never pushed: the build is the shell check.
	local unbuilt=''
	if [ "$BUILD" != 1 ]; then
		unbuilt="BUILD=0, so not built"
	elif ! has_api_key; then
		unbuilt="no YNS_API_KEY, so not built"
	elif ! build; then
		[ "$AGENT" != none ] || finish needs-agent "bun run build fails"
		agent "$(failure_prompt "bun run build" "$RUN/logs/$T.build")"
		stage_resolved
		normalize
		build || finish failed "bun run build still fails"
	fi

	if g diff --cached --quiet "$MAIN"; then
		finish failed "nothing of the theme is left on top of main"
	fi
	g commit -q --no-verify -C "$THEME_COMMIT" || finish failed "git commit failed"
	NEW="$(git rev-parse HEAD)"

	REVIEW="$(review_reasons)"
	if [ -n "$REVIEW" ]; then
		finish review
	elif [ -n "$unbuilt" ]; then
		finish unbuilt "$unbuilt"
	fi
	finish ok
}

# Paths with unmerged index entries.
unmerged() { git ls-files -u | cut -f2 | sort -u; }

# Main's side of an unmerged path, or its deletion when main removed the file.
take_main() {
	if git ls-files -u -- "$1" | awk '$3 == 2 { found = 1 } END { exit !found }'; then
		g checkout --ours -- "$1" && g add -- "$1"
	else
		g rm -q -- "$1"
	fi
}

# A package.json the theme's own commits changed: main's file plus the dependencies
# and scripts the theme added since the merge base. Main wins every shared key, so
# a package main removed stays removed.
merge_package_json() {
	local f="$RUN/logs/$T.package"
	g show :1:package.json >"$f.base" 2>/dev/null || return 1
	g show :2:package.json >"$f.main" 2>/dev/null || return 1
	g show :3:package.json >"$f.theme" 2>/dev/null || return 1
	jq -s '
		. as [$base, $main, $theme]
		| reduce ("dependencies", "devDependencies", "scripts") as $k ($main;
			(.[$k] // {}) as $kept
			| (($theme[$k] // {}) | with_entries(select(.key as $key
				| (($base[$k] // {}) | has($key) | not) and ($kept | has($key) | not)))) as $added
			| if ($added | length) == 0 then .
				elif $k == "scripts" then .[$k] = $kept + $added
				else .[$k] = ($kept + $added | to_entries | sort_by(.key) | from_entries)
				end)
	' "$f.base" "$f.main" "$f.theme" >package.json || return 1
	g add package.json
}

# Stage what the agent resolved but left unstaged: a file without markers is added,
# a missing one removed. Anything still holding markers stays unmerged.
stage_resolved() {
	local p
	while IFS= read -r p; do
		if [ ! -e "$p" ]; then
			g rm -q -- "$p"
		elif ! grep -qE '^(<<<<<<<|\|\|\|\|\|\|\||>>>>>>>)( |$)' "$p"; then
			g add -- "$p"
		fi
	done < <(unmerged)
}

# Route types (`PageProps`, …) live in .next/types, which a fresh worktree lacks.
normalize() {
	bun install || true
	bun next typegen || true
	bun run lint || true
	g add -A
}

has_api_key() {
	[ -n "${YNS_API_KEY:-}" ] || grep -qs '^YNS_API_KEY=.' .env .env.local
}

# A network error from the live store API is retried once, never sent to the agent.
build() {
	local attempt
	for attempt in 1 2; do
		if bun run build >"$RUN/logs/$T.build" 2>&1; then
			return 0
		fi
		grep -qE '(^|[^0-9])429([^0-9]|$)|ECONNRESET|ETIMEDOUT|fetch failed|socket hang up' "$RUN/logs/$T.build" || return 1
		printf 'build: network error, retrying (attempt %s)\n' "$attempt"
	done
	return 1
}

# One Claude session per theme; later calls resume it, so the agent keeps what it
# learned about this theme. Its tools stop at the worktree: no commits, no branches.
agent() {
	local out
	out="$RUN/logs/$T.agent-$(date +%s).json"
	printf '%s\n' "$1" >"${out%.json}.prompt.md"
	local args=(-p "$1" --output-format json --model "$AGENT_MODEL" --max-budget-usd "$AGENT_BUDGET"
		--append-system-prompt-file "$SKILL_DIR/rules.md"
		--tools Read Edit Write Glob Grep Bash
		--allowedTools Read Edit Write Glob Grep
		'Bash(git diff:*)' 'Bash(git show:*)' 'Bash(git log:*)' 'Bash(git status:*)' 'Bash(git ls-files:*)'
		'Bash(git add:*)' 'Bash(git rm:*)' 'Bash(git checkout --ours:*)' 'Bash(git checkout --theirs:*)'
		'Bash(bun install)' 'Bash(bun next typegen)' 'Bash(bun run check)' 'Bash(bun run lint)' 'Bash(bun run build)'
		'Bash(bun test:*)' 'Bash(bun tsc:*)' 'Bash(head:*)' 'Bash(tail:*)'
		--permission-mode dontAsk --permission-prompts none
		--disable-slash-commands --strict-mcp-config --setting-sources project)
	if [ -n "$SESSION" ]; then
		args+=(--resume "$SESSION")
	fi
	claude "${args[@]}" >"$out" || true
	local id
	id="$(jq -r '.session_id // empty' "$out" 2>/dev/null || true)"
	[ -z "$id" ] || SESSION="$id"
	COST="$(jq -r --argjson c "$COST" '$c + (.total_cost_usd // 0)' "$out" 2>/dev/null || printf '%s' "$COST")"
	AGENT_NOTE="$(jq -r 'if .is_error or .subtype != "success" then "agent: \(.subtype // "error")" else empty end' "$out" 2>/dev/null || printf 'agent: no output')"
}

brief() {
	local p list=''
	while IFS= read -r p; do
		case "$(git ls-files -u -- "$p" | awk '{ printf "%s", $3 }')" in
			13) list="$list- $p (main deleted it; the theme changed it)"$'\n' ;;
			12) list="$list- $p (the theme deleted it; main changed it)"$'\n' ;;
			23) list="$list- $p (added on both sides)"$'\n' ;;
			*) list="$list- $p"$'\n' ;;
		esac
	done <<<"$BY_AGENT"
	cat <<EOF
You are finishing the rebase of the YNS storefront theme $T onto main, in a git worktree that is your working directory.

The working tree is main ($MAIN) with the theme squash-merged on top. Merge base: $BASE. The theme's own commit: $THEME_COMMIT. The theme branch tip: $OLD.

These paths are still unmerged:
$list
For each path, read what each side changed since the merge base, then resolve it by the rules in your instructions:
  git diff $BASE $MAIN -- '<path>'   (main)
  git diff $BASE $OLD -- '<path>'   (the theme)

Stage every resolved path with \`git add '<path>'\`, or \`git rm '<path>'\` where the file should stay deleted.

Then run \`bun install\`, \`bun next typegen\` and \`bun run check\`, and fix whatever fails until it passes. Files that merged cleanly can still fail: theme-owned files that import modules main deleted or moved. Stage those fixes too.

Don't commit, and don't switch branches or rewrite history: the script commits once the checks and the build pass. Finish with one line per path on how you resolved it, then anything a reviewer should look at.
EOF
}

failure_prompt() {
	printf "\`%s\` fails after the merge:\n\n\`\`\`\n%s\n\`\`\`\n\nFix it by the rules in your instructions and stage your changes. Never edit tests, scripts or config to make it pass.\n" \
		"$1" "$(tail -n 80 "$2")"
}

# Why a built theme still needs a human before it is pushed.
review_reasons() {
	local p final theme base main
	while IFS= read -r p; do
		case "$p" in package.json | bun.lock) continue ;; esac
		final="$(git rev-parse -q --verify "HEAD:$p" 2>/dev/null)" || continue
		theme="$(git rev-parse -q --verify "$OLD:$p" 2>/dev/null)" || continue
		base="$(git rev-parse -q --verify "$BASE:$p" 2>/dev/null || true)"
		main="$(git rev-parse -q --verify "$MAIN:$p" 2>/dev/null || true)"
		if [ "$theme" != "$base" ] && [ "$final" = "$main" ]; then
			printf '%s lost the theme: it now matches main\n' "$p"
		fi
	done <"$TPATHS"

	# The checks themselves, changed into something neither main nor the theme had.
	for p in app/palette.test.ts lib/contrast.ts scripts tsconfig.json biome.json lint-staged.config.mjs; do
		final="$(git rev-parse -q --verify "HEAD:$p" 2>/dev/null || true)"
		main="$(git rev-parse -q --verify "$MAIN:$p" 2>/dev/null || true)"
		theme="$(git rev-parse -q --verify "$OLD:$p" 2>/dev/null || true)"
		if [ "$final" != "$main" ] && [ "$final" != "$theme" ]; then
			printf '%s was edited during the rebase\n' "$p"
		fi
	done
	local gates='.scripts | {check, build, lint, test}'
	final="$(git show HEAD:package.json | jq -c "$gates")"
	if [ "$final" != "$(git show "$MAIN:package.json" | jq -c "$gates")" ] &&
		[ "$final" != "$(git show "$OLD:package.json" | jq -c "$gates")" ]; then
		printf 'the check, build, lint or test script was edited during the rebase\n'
	fi
	local want have
	want="$(git grep -l 'export const ensureStatic' "$MAIN" -- app | wc -l | tr -d ' ')"
	have="$(git grep -l 'export const ensureStatic' HEAD -- app | wc -l | tr -d ' ')"
	if [ "$have" -lt "$want" ]; then
		printf 'ensureStatic on %s pages, main has %s\n' "$have" "$want"
	fi
}

# Record the theme's row and print its line. The worktree stays only where someone
# still has work to do in it; a needs-agent theme is cheap to re-run.
finish() {
	local status="$1" note="${2:-}"
	DONE=1
	cd "$ROOT"
	[ -n "$note" ] || note="$AGENT_NOTE"
	case "$status" in
		failed | review) ;;
		*)
			if [ -n "$KEPT" ]; then
				g worktree remove --force "$KEPT" || true
				KEPT=''
			fi
			if [ "$status" = needs-agent ]; then g branch -q -D "$BR" || true; fi
			;;
	esac
	jq -nc --arg theme "$T" --arg status "$status" --arg note "$note" --arg main "${MAIN:-}" \
		--arg base "$BASE" --arg oldTip "$OLD" --arg newTip "$NEW" --arg themeCommit "$THEME_COMMIT" \
		--arg fromMain "$FROM_MAIN" --arg byRule "$BY_RULE" --arg byAgent "$BY_AGENT" --arg review "$REVIEW" \
		--arg session "$SESSION" --argjson cost "$COST" --arg worktree "$KEPT" '
		def lines: split("\n") | map(select(length > 0));
		{theme: $theme, status: $status, note: $note, main: $main, base: $base, oldTip: $oldTip,
		 newTip: $newTip, themeCommit: $themeCommit,
		 conflicts: {main: ($fromMain | lines), rule: ($byRule | lines), agent: ($byAgent | lines)},
		 review: ($review | lines), session: $session, cost: $cost, worktree: $worktree}' \
		>>"$RUN/results.jsonl"
	local summary=''
	if [ -n "$BASE" ]; then
		summary="conflicts: $(count "$FROM_MAIN") main, $(count "$BY_RULE") rule, $(count "$BY_AGENT") agent; \$$COST"
	fi
	printf '%-10s %-11s %s%s\n' "$T" "$status" "$summary" "${note:+  $note}" >&3
	exit 0
}

# --- push --------------------------------------------------------------------

cmd_push() {
	RUN="$STATE/latest"
	[ -s "$RUN/results.jsonl" ] || die "no run to push: use run first."
	RUN="$(cd "$RUN" && pwd -P)"

	local themes=() t
	if [ "$#" -gt 0 ]; then
		themes=("$@")
	else
		while IFS= read -r t; do
			themes+=("$t")
		done < <(latest_rows | jq -r 'select(.status == "ok") | .theme')
	fi
	if [ "${#themes[@]}" -eq 0 ]; then
		printf 'Nothing to push.\n'
		return 0
	fi
	for t in "${themes[@]}"; do
		push_one "$t"
	done
	table "$RUN"
}

latest_rows() { jq -cs 'group_by(.theme) | map(last) | .[]' "$RUN/results.jsonl"; }

# Push the branch and a backup tag at the old tip in one atomic push, leased on the
# tip the run started from: if someone pushed to the theme since, nothing lands.
push_one() {
	local t="$1" row status old main br new tag out
	row="$(latest_rows | jq -c --arg t "$t" 'select(.theme == $t)')"
	[ -n "$row" ] || { printf '%-10s skipped: not in the last run\n' "$t"; return 0; }
	status="$(jq -r .status <<<"$row")"
	old="$(jq -r .oldTip <<<"$row")"
	main="$(jq -r .main <<<"$row")"
	br="theme-rebase/$t"
	case "$status" in
		ok | review | failed) ;;
		*) printf '%-10s skipped: %s\n' "$t" "$status"; return 0 ;;
	esac
	new="$(git -C "$ROOT" rev-parse -q --verify "refs/heads/$br")" || { printf '%-10s skipped: no %s\n' "$t" "$br"; return 0; }
	if [ "$(git -C "$ROOT" rev-list --count "$main..$new")" != 1 ] || [ "$(git -C "$ROOT" rev-parse "$new^")" != "$main" ]; then
		printf '%-10s skipped: %s is not one commit on top of main %s\n' "$t" "$br" "${main:0:7}"
		return 0
	fi
	tag="backup/$t/$(date +%Y-%m-%d)-${old:0:7}"
	if out="$(git -C "$ROOT" push --quiet --atomic --force-with-lease="refs/heads/$t:$old" origin \
		"$new:refs/heads/$t" "$old:refs/tags/$tag" 2>&1)"; then
		jq -c --arg new "$new" '.status = "pushed" | .newTip = $new | .note = "" | .worktree = ""' <<<"$row" >>"$RUN/results.jsonl"
		local wt
		wt="$(jq -r .worktree <<<"$row")"
		if [ -n "$wt" ]; then g -C "$ROOT" worktree remove --force "$wt" || true; fi
		g -C "$ROOT" branch -q -D "$br" || true
		printf '%-10s pushed     %s, backup %s\n' "$t" "${new:0:7}" "$tag"
	else
		local note
		case "$out" in
			*"stale info"* | *"fetch first"*)
				status=stale
				note="origin/$t moved after the run started"
				;;
			*)
				status=failed
				note="push: $(grep -m 1 -E '^ ! |^error:|^fatal:' <<<"$out" | cut -c1-160 || true)"
				;;
		esac
		jq -c --arg s "$status" --arg note "$note" '.status = $s | .note = $note' <<<"$row" >>"$RUN/results.jsonl"
		printf '%-10s %-11s %s\n' "$t" "$status" "$note"
	fi
}

# --- clean -------------------------------------------------------------------

cmd_clean() {
	local wt br
	while IFS= read -r wt; do
		case "$wt" in
			"$STATE"/*) g -C "$ROOT" worktree remove --force "$wt" && printf 'removed %s\n' "$wt" ;;
		esac
	done < <(git -C "$ROOT" worktree list --porcelain | sed -n 's/^worktree //p')
	git -C "$ROOT" worktree prune
	while IFS= read -r br; do
		g -C "$ROOT" branch -q -D "$br" && printf 'deleted %s\n' "$br"
	done < <(git -C "$ROOT" for-each-ref --format='%(refname:short)' 'refs/heads/theme-rebase/')
}

# --- report ------------------------------------------------------------------

# The latest row per theme as a table; exits non-zero unless every theme is done.
table() {
	local results="$1/results.jsonl"
	[ -s "$results" ] || die "no results in $1"
	printf '\n'
	jq -rs '
		group_by(.theme) | map(last) | sort_by(.theme)
		| (["THEME", "STATUS", "MAIN", "RULE", "AGENT", "COST", "NOTES"] | @tsv),
		  (.[] | [.theme, .status,
			(.conflicts.main | length), (.conflicts.rule | length), (.conflicts.agent | length),
			("$" + (.cost * 100 | round / 100 | tostring)),
			([.note] + .review + (if .worktree != "" then ["worktree " + .worktree] else [] end)
				| map(select(. != "")) | join("; "))]
			| @tsv)
	' "$results" | column -t -s "$(printf '\t')"
	printf '\nRows: %s\n' "$results"
	jq -es 'group_by(.theme) | map(last) | all(.status == "up-to-date" or .status == "ok" or .status == "pushed")' \
		"$results" >/dev/null
}

case "${1:-}" in
	run) shift && cmd_run "$@" ;;
	push) shift && cmd_push "$@" ;;
	clean) cmd_clean ;;
	one) shift && cmd_one "$@" ;;
	*) usage ;;
esac
