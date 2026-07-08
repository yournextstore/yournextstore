#!/usr/bin/env bash
# Call any YNS Store API endpoint with this store's API key.
#
# Usage: scripts/api.sh <METHOD> <path> [json-body]
#   scripts/api.sh GET  /products?limit=5
#   scripts/api.sh POST /publish
#   scripts/api.sh POST /products '{"name":"Tee","price":29.99}'
#
# Reads YNS_API_KEY (and optional YNS_API_URL) from the environment or the
# repo's .env.local / .env. Prints the JSON response (pretty when stdout is
# a terminal); exits non-zero on HTTP >= 400.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

METHOD="${1:?usage: scripts/api.sh <METHOD> <path> [json-body]}"
API_PATH="${2:?usage: scripts/api.sh <METHOD> <path> [json-body]}"
BODY="${3:-}"

for envfile in "$ROOT/.env.local" "$ROOT/.env"; do
	[ -f "$envfile" ] || continue
	while IFS='=' read -r key value; do
		if [ -z "${!key:-}" ]; then
			value="${value%\"}"
			export "$key=${value#\"}"
		fi
	done < <(grep -E '^(YNS_API_KEY|YNS_API_URL)=' "$envfile" || true)
done

: "${YNS_API_KEY:?YNS_API_KEY is required (the store API key, from admin Settings > API Keys)}"

if [ -z "${YNS_API_URL:-}" ]; then
	case "$YNS_API_KEY" in
		sk-s-*) YNS_API_URL="https://yns.cx" ;;
		*) YNS_API_URL="https://yns.store" ;;
	esac
fi

CURL_ARGS=(-sS -w '\n%{http_code}' -X "$METHOD" -H "Authorization: Bearer $YNS_API_KEY")
[ -n "$BODY" ] && CURL_ARGS+=(-H "Content-Type: application/json" -d "$BODY")

RAW="$(curl "${CURL_ARGS[@]}" "$YNS_API_URL/api/v1${API_PATH}")"
STATUS="${RAW##*$'\n'}"
RESPONSE="${RAW%$'\n'*}"

if [ -t 1 ]; then
	jq . <<<"$RESPONSE" 2>/dev/null || printf '%s\n' "$RESPONSE"
else
	printf '%s\n' "$RESPONSE"
fi

[ "$STATUS" -lt 400 ]
