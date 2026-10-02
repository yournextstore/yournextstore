#!/usr/bin/env bash
# Publish this store: deploy the commit at the tenant repo's remote `main`.
# Sends that commit to POST /api/v1/publish, which builds it without touching
# the design workspace, then polls until the publish is live or has failed.
#
# Only what is pushed gets published, so the script refuses to run from a
# checkout that holds anything else: uncommitted changes, or a HEAD that is not
# `origin/main`. Unpublished edits made on the admin Design page are not
# included either; they go out with the next publish from there.
#
# Usage: scripts/publish.sh [--no-wait]

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
API="$(dirname "${BASH_SOURCE[0]}")/api.sh"
SHELL_CHECK="$(dirname "${BASH_SOURCE[0]}")/check-shell.sh"

POLL_INTERVAL=5
POLL_ATTEMPTS=180

# Pull the human-readable bit out of an API error body, falling back to the
# raw payload when it isn't the shape we expect.
concise_error() {
	local body="$1" msg
	msg="$(jq -r '.error // .message // empty' <<<"$body" 2>/dev/null || true)"
	printf '%s' "${msg:-$(tr -d '\n' <<<"$body" | cut -c1-300)}"
}

fail() {
	printf 'Publish failed: %s\n' "$1" >&2
	[ -n "${2:-}" ] && printf 'Logs: %s\n' "$2" >&2
	exit 1
}

refuse() {
	printf 'Not publishing: %s\n' "$1" >&2
	exit 1
}

DIRTY="$(git -C "$ROOT" status --porcelain)"
if [ -n "$DIRTY" ]; then
	printf '%s\n' "$DIRTY" | head -n 10 >&2
	refuse "this checkout has uncommitted changes. Commit and push them, or stash them."
fi

git -C "$ROOT" fetch --quiet origin main || refuse "could not fetch origin/main."
HEAD_SHA="$(git -C "$ROOT" rev-parse HEAD)"
REMOTE_SHA="$(git -C "$ROOT" rev-parse FETCH_HEAD)"
if [ "$HEAD_SHA" != "$REMOTE_SHA" ]; then
	AHEAD="$(git -C "$ROOT" rev-list --count "$REMOTE_SHA..$HEAD_SHA")"
	BEHIND="$(git -C "$ROOT" rev-list --count "$HEAD_SHA..$REMOTE_SHA")"
	refuse "HEAD (${HEAD_SHA:0:7}) is not origin/main (${REMOTE_SHA:0:7}): $AHEAD commit(s) not pushed, $BEHIND not pulled. Push or pull first."
fi

echo "Publishing $(git -C "$ROOT" log -1 --format='%h %s' "$HEAD_SHA")"

BODY="$(jq -nc --arg sha "$HEAD_SHA" '{source: "remote", expectedSha: $sha}')"
if ! RESPONSE="$("$API" POST /publish "$BODY" 2>&1)"; then
	fail "$(concise_error "$RESPONSE")"
fi

# `publishId` follows the publish whichever machine builds it; the deployment
# fields are informational and may be null until the build uploads. A platform
# that predates publish ids answers with a pollable `deploymentId` instead.
PUBLISH_ID="$(jq -r '.publishId // .deploymentId // empty' <<<"$RESPONSE" 2>/dev/null || true)"
DEPLOYMENT_URL="$(jq -r '.deploymentUrl // empty' <<<"$RESPONSE" 2>/dev/null || true)"
INSPECTOR_URL="$(jq -r '.inspectorUrl // empty' <<<"$RESPONSE" 2>/dev/null || true)"

[ -n "$PUBLISH_ID" ] || fail "unexpected response: $(concise_error "$RESPONSE")"

echo "Publish started: $PUBLISH_ID"
[ -n "$INSPECTOR_URL" ] && echo "Inspect: $INSPECTOR_URL"

if [ "${1:-}" = "--no-wait" ]; then
	echo "Publish running — not waiting. Check it with: bun run api GET /publish/$PUBLISH_ID"
	exit 0
fi

ELAPSED=0
STALE_POLLS=0
LAST_STATE=''

# Log each state change with the elapsed clock. The API reports no completion
# percentage, so state + elapsed time is the honest picture — no faux bar.
for _ in $(seq 1 "$POLL_ATTEMPTS"); do
	sleep "$POLL_INTERVAL"
	ELAPSED=$((ELAPSED + POLL_INTERVAL))

	if ! POLL="$("$API" GET "/publish/$PUBLISH_ID" 2>&1)"; then
		# A single hiccup mid-build shouldn't kill the run; a run of them should.
		STALE_POLLS=$((STALE_POLLS + 1))
		[ "$STALE_POLLS" -ge 3 ] && fail "lost contact with the API: $(concise_error "$POLL")" "$INSPECTOR_URL"
		continue
	fi
	STALE_POLLS=0

	# `status` is the publish; `readyState` is only the build, and is what a
	# deployment-id poll answers on a platform that predates publish ids.
	STATE="$(jq -r '.status // .readyState // "UNKNOWN"' <<<"$POLL" 2>/dev/null || echo UNKNOWN)"
	[ -z "$DEPLOYMENT_URL" ] && DEPLOYMENT_URL="$(jq -r '.url // .deploymentUrl // empty' <<<"$POLL" 2>/dev/null || true)"
	REASON="$(jq -r '.reason // .errorMessage // .error // empty' <<<"$POLL" 2>/dev/null || true)"

	case "$STATE" in
		live | READY)
			printf '  %-12s (%ds)\n' "published" "$ELAPSED"
			printf '  → https://%s\n' "$DEPLOYMENT_URL"
			# Informational only — the deploy already happened, so a regressed shell
			# is reported, not fatal. The live first flush is the same shell the
			# build gate measures. A store that predates the gate has no check to run.
			if [ -n "$DEPLOYMENT_URL" ] && [ -f "$SHELL_CHECK" ]; then
				YNS_SHELL_CHECK=warn bash "$SHELL_CHECK" "https://$DEPLOYMENT_URL/" || true
			fi
			exit 0
			;;
		domain_pending)
			# Built and deployed, but a domain didn't attach — not live, so not a success.
			fail "built, but not live yet (${ELAPSED}s)${REASON:+: $REASON}" "$INSPECTOR_URL"
			;;
		failed | ERROR | CANCELED)
			fail "${STATE} (${ELAPSED}s)${REASON:+: $REASON}" "$INSPECTOR_URL"
			;;
	esac

	# Only print on a transition, so the log reads as a timeline, not a poll dump.
	if [ "$STATE" != "$LAST_STATE" ]; then
		printf '  %-12s (%ds)\n' "$(tr '[:upper:]' '[:lower:]' <<<"$STATE")" "$ELAPSED"
		LAST_STATE="$STATE"
	fi
done

fail "timed out after $((ELAPSED / 60))m — the publish is still running (bun run api GET /publish/$PUBLISH_ID)" "$INSPECTOR_URL"
