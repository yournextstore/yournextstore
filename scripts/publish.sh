#!/usr/bin/env bash
# Publish this store — the CLI twin of the admin "Publish" button.
# Triggers a production build of the tenant repo's remote `main` (push first!)
# via POST /api/v1/publish, then polls until the build finishes.
#
# Usage: scripts/publish.sh [--no-wait]

set -euo pipefail

API="$(dirname "${BASH_SOURCE[0]}")/api.sh"

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

if ! RESPONSE="$("$API" POST /publish 2>&1)"; then
	fail "$(concise_error "$RESPONSE")"
fi

DEPLOYMENT_ID="$(jq -r '.deploymentId // empty' <<<"$RESPONSE" 2>/dev/null || true)"
DEPLOYMENT_URL="$(jq -r '.deploymentUrl // empty' <<<"$RESPONSE" 2>/dev/null || true)"
INSPECTOR_URL="$(jq -r '.inspectorUrl // empty' <<<"$RESPONSE" 2>/dev/null || true)"

[ -n "$DEPLOYMENT_ID" ] || fail "unexpected response: $(concise_error "$RESPONSE")"

echo "Deployment created: $DEPLOYMENT_ID"
[ -n "$INSPECTOR_URL" ] && echo "Inspect: $INSPECTOR_URL"

if [ "${1:-}" = "--no-wait" ]; then
	echo "Build running — not waiting."
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

	if ! POLL="$("$API" GET "/publish/$DEPLOYMENT_ID" 2>&1)"; then
		# A single hiccup mid-build shouldn't kill the run; a run of them should.
		STALE_POLLS=$((STALE_POLLS + 1))
		[ "$STALE_POLLS" -ge 3 ] && fail "lost contact with the API: $(concise_error "$POLL")" "$INSPECTOR_URL"
		continue
	fi
	STALE_POLLS=0

	STATE="$(jq -r '.readyState // "UNKNOWN"' <<<"$POLL" 2>/dev/null || echo UNKNOWN)"
	[ -z "$DEPLOYMENT_URL" ] && DEPLOYMENT_URL="$(jq -r '.deploymentUrl // empty' <<<"$POLL" 2>/dev/null || true)"

	case "$STATE" in
		READY)
			printf '  %-12s (%ds)\n' "published" "$ELAPSED"
			printf '  → https://%s\n' "$DEPLOYMENT_URL"
			exit 0
			;;
		ERROR | CANCELED)
			REASON="$(jq -r '.errorMessage // .error // empty' <<<"$POLL" 2>/dev/null || true)"
			fail "${STATE} (${ELAPSED}s)${REASON:+: $REASON}" "$INSPECTOR_URL"
			;;
	esac

	# Only print on a transition, so the log reads as a timeline, not a poll dump.
	if [ "$STATE" != "$LAST_STATE" ]; then
		printf '  %-12s (%ds)\n' "$(tr '[:upper:]' '[:lower:]' <<<"$STATE")" "$ELAPSED"
		LAST_STATE="$STATE"
	fi
done

fail "timed out after $((ELAPSED / 60))m — the build is still running on Vercel" "$INSPECTOR_URL"
