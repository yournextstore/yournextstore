#!/usr/bin/env bash
# Verify the prerendered shell: the chrome must sit in the first flush of every
# prerendered document, not in a segment streamed in afterwards. A <Suspense>
# above the header — or a request-time read awaited there — makes the shell
# prerender empty, and since the layout's boundaries have no fallback the page
# paints blank white until the server responds. See AGENTS.md, "The prerendered
# shell".
#
# Usage: scripts/check-shell.sh [file-or-url ...]   (default: .next/server/app/**/*.html)
#        YNS_SHELL_CHECK=warn   report failures, exit 0
#        YNS_SHELL_CHECK=off    skip the check entirely

set -euo pipefail
export LC_ALL=C

MODE="${YNS_SHELL_CHECK:-on}"
if [ "$MODE" = "off" ]; then
	exit 0
fi

BUILD_DIR=".next/server/app"
FETCH_DIR=''

cleanup() {
	[ -n "$FETCH_DIR" ] && rm -rf "$FETCH_DIR"
	return 0
}
trap cleanup EXIT

TARGETS=()
if [ "$#" -gt 0 ]; then
	TARGETS=("$@")
else
	if [ ! -d "$BUILD_DIR" ]; then
		printf 'check-shell: no %s — run `bun next build` first.\n' "$BUILD_DIR" >&2
		exit 1
	fi
	while IFS= read -r f; do
		TARGETS+=("$f")
	done < <(find "$BUILD_DIR" -name '*.html' | sort)
fi

CHECKED=0
FAILED=0

for TARGET in ${TARGETS+"${TARGETS[@]}"}; do
	LABEL="${TARGET#"$BUILD_DIR"/}"
	FILE="$TARGET"

	case "$TARGET" in
		http://* | https://*)
			# The static shell is the first flush of the live response too, so the
			# same rule applies to a deployed URL.
			[ -n "$FETCH_DIR" ] || FETCH_DIR="$(mktemp -d)"
			FILE="$FETCH_DIR/$(tr -c 'A-Za-z0-9' '_' <<<"$TARGET")"
			if ! curl -sS -o "$FILE" "$TARGET"; then
				printf 'FAIL  %s  could not be fetched\n' "$LABEL"
				FAILED=$((FAILED + 1))
				continue
			fi
			;;
		*)
			if [ ! -f "$FILE" ]; then
				printf 'FAIL  %s  no such file\n' "$LABEL"
				FAILED=$((FAILED + 1))
				continue
			fi
			;;
	esac

	# Error documents (_global-error, and routes that resolved to notFound() while
	# prerendering) replace the root layout by design, so they carry no chrome and
	# are not shells to measure.
	if grep -q 'id="__next_error__"' "$FILE"; then
		printf 'skip  %s  error document (no root layout)\n' "$LABEL"
		continue
	fi

	CHECKED=$((CHECKED + 1))
	# One document is often a single line, so -m1 alone still yields every match on it.
	HEADER_AT="$(grep -b -o -m1 -E '<header|role="banner"' "$FILE" | cut -d: -f1 | head -n1 || true)"
	STREAM_AT="$(grep -b -o -m1 '<div hidden id="S:' "$FILE" | cut -d: -f1 | head -n1 || true)"

	if [ -z "$HEADER_AT" ]; then
		printf 'FAIL  %s  no chrome in the prerendered shell\n' "$LABEL"
		FAILED=$((FAILED + 1))
	elif [ -n "$STREAM_AT" ] && [ "$HEADER_AT" -gt "$STREAM_AT" ]; then
		printf 'FAIL  %s  header@%s is inside a streamed segment (stream@%s)\n' "$LABEL" "$HEADER_AT" "$STREAM_AT"
		FAILED=$((FAILED + 1))
	else
		printf 'ok    %s  header@%s stream@%s\n' "$LABEL" "$HEADER_AT" "${STREAM_AT:-none}"
	fi
done

if [ "$FAILED" -eq 0 ]; then
	printf 'check-shell: %d document(s) ok\n' "$CHECKED"
	exit 0
fi

cat >&2 <<'MSG'

check-shell: the chrome is missing from the prerendered shell of the documents
marked FAIL above. The usual causes:

  1. a <Suspense> around the children/chrome wrapper in app/layout.tsx — the
     boundary alone streams the chrome out of the shell, even when everything
     inside it is a cached read;
  2. a request-time read — cookies(), headers(), searchParams, params — awaited
     above the chrome instead of below it (see CartBootstrapper);
  3. a client component in the chrome reading usePathname() or useSearchParams()
     without its own <Suspense> around it (see SearchInput); on a listing page,
     controls that read the URL belong inside the grid's boundary.

See AGENTS.md, "The prerendered shell". YNS_SHELL_CHECK=warn downgrades this to
a warning, YNS_SHELL_CHECK=off skips it.
MSG

if [ "$MODE" = "warn" ]; then
	exit 0
fi
exit 1
