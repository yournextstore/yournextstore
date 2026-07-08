#!/usr/bin/env bash
# Publish this store — the CLI twin of the admin "Publish" button.
# Triggers a production build of the tenant repo's remote `main` (push first!)
# via POST /api/v1/publish, then polls until the build finishes.
#
# Usage: scripts/publish.sh [--no-wait]

set -euo pipefail

API="$(dirname "${BASH_SOURCE[0]}")/api.sh"

RESPONSE="$("$API" POST /publish)"
DEPLOYMENT_ID="$(jq -r '.deploymentId' <<<"$RESPONSE")"
DEPLOYMENT_URL="$(jq -r '.deploymentUrl // empty' <<<"$RESPONSE")"
INSPECTOR_URL="$(jq -r '.inspectorUrl // empty' <<<"$RESPONSE")"

echo "Deployment created: $DEPLOYMENT_ID"
[ -n "$INSPECTOR_URL" ] && echo "Inspect: $INSPECTOR_URL"

if [ "${1:-}" = "--no-wait" ]; then
	echo "Build running — not waiting."
	exit 0
fi

echo -n "Building"
for _ in $(seq 1 180); do
	sleep 5
	STATE="$("$API" GET "/publish/$DEPLOYMENT_ID" | jq -r '.readyState // "UNKNOWN"')"
	case "$STATE" in
		READY)
			echo
			echo "Published: https://$DEPLOYMENT_URL"
			exit 0
			;;
		ERROR|CANCELED)
			echo
			echo "Deployment $STATE" >&2
			[ -n "$INSPECTOR_URL" ] && echo "Logs: $INSPECTOR_URL" >&2
			exit 1
			;;
		*) echo -n "." ;;
	esac
done

echo
echo "Timed out waiting for the build (still running on Vercel)." >&2
exit 1
