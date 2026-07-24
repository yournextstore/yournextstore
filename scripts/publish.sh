#!/usr/bin/env bash
# Publish this store — the CLI twin of the admin "Publish" button.
# Triggers a production build of the tenant repo's remote `main` (push first!)
# via POST /api/v1/publish, then polls until the build finishes.
#
# Usage: scripts/publish.sh [--no-wait]

set -euo pipefail

API="$(dirname "${BASH_SOURCE[0]}")/api.sh"

BAR_WIDTH=28
POLL_INTERVAL=5
POLL_ATTEMPTS=180
# Only an estimate — the API reports no percentage, so the bar paces itself
# against a typical build and holds at 95% until the state actually flips.
EST_BUILD_SECONDS=120

[ -t 1 ] && INTERACTIVE=1 || INTERACTIVE=0

# Pull the human-readable bit out of an API error body, falling back to the
# raw payload when it isn't the shape we expect.
concise_error() {
	local body="$1" msg
	msg="$(jq -r '.error // .message // empty' <<<"$body" 2>/dev/null || true)"
	printf '%s' "${msg:-$(tr -d '\n' <<<"$body" | cut -c1-300)}"
}

fail() {
	[ "$INTERACTIVE" = 1 ] && printf '\r\033[K'
	printf 'Publish failed: %s\n' "$1" >&2
	[ -n "${2:-}" ] && printf 'Logs: %s\n' "$2" >&2
	exit 1
}

repeat() {
	local n="$1" out=''
	while [ "$n" -gt 0 ]; do
		out="$out$2"
		n=$((n - 1))
	done
	printf '%s' "$out"
}

draw() {
	local pct="$1" label="$2" secs="$3" filled
	[ "$INTERACTIVE" = 1 ] || return 0
	filled=$((pct * BAR_WIDTH / 100))
	printf '\r\033[K  %s%s  %3d%%  %-12s %02d:%02d' \
		"$(repeat "$filled" '█')" "$(repeat $((BAR_WIDTH - filled)) '░')" \
		"$pct" "$label" $((secs / 60)) $((secs % 60))
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

# Hide the cursor so it doesn't strobe across the bar; always put it back.
if [ "$INTERACTIVE" = 1 ]; then
	tput civis 2>/dev/null || true
	trap 'tput cnorm 2>/dev/null || true; printf "\n"' EXIT
fi

ELAPSED=0
STALE_POLLS=0
LAST_LABEL=''

draw 0 "starting" 0

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

	PCT=$((ELAPSED * 95 / EST_BUILD_SECONDS))
	[ "$PCT" -gt 95 ] && PCT=95

	case "$STATE" in
		READY)
			draw 100 "published" "$ELAPSED"
			[ "$INTERACTIVE" = 1 ] && printf '\r\033[K'
			printf 'Published in %dm%02ds: https://%s\n' $((ELAPSED / 60)) $((ELAPSED % 60)) "$DEPLOYMENT_URL"
			exit 0
			;;
		ERROR | CANCELED)
			REASON="$(jq -r '.errorMessage // .error // empty' <<<"$POLL" 2>/dev/null || true)"
			fail "deployment ${STATE} after $((ELAPSED / 60))m$((ELAPSED % 60))s${REASON:+ — $REASON}" "$INSPECTOR_URL"
			;;
		QUEUED) LABEL="queued" ;;
		INITIALIZING) LABEL="initializing" ;;
		BUILDING) LABEL="building" ;;
		*) LABEL="$(tr '[:upper:]' '[:lower:]' <<<"$STATE")" ;;
	esac

	# Without a TTY (CI, piped output) a redrawn bar is noise — log transitions.
	if [ "$INTERACTIVE" = 1 ]; then
		draw "$PCT" "$LABEL" "$ELAPSED"
	elif [ "$LABEL" != "$LAST_LABEL" ]; then
		printf '  %s (%ds)\n' "$LABEL" "$ELAPSED"
	fi
	LAST_LABEL="$LABEL"
done

fail "timed out after $((ELAPSED / 60))m — the build is still running on Vercel" "$INSPECTOR_URL"
