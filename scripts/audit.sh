#!/usr/bin/env bash
# Run Lighthouse against a storefront URL and print the parts worth acting on:
# the performance + accessibility scores, FCP/LCP/TBT, every failing
# accessibility audit with its offending nodes, and the render-blocking /
# LCP / network-dependency insights.
#
# Usage: scripts/audit.sh <url> [--desktop]
#   scripts/audit.sh http://localhost:3000/
#   scripts/audit.sh https://example.yns.store/products --desktop
#
# Reading the numbers: the accessibility audits are deterministic — a failure
# here is a real defect and a pass is a real pass. The performance side is
# *simulated* (Lighthouse throttles by modelling, not by waiting), so FCP/LCP/TBT
# swing by roughly ±0.3 s between runs on the same build; compare trends across
# several runs, never two single numbers. The score that actually counts is
# PageSpeed Insights on the live production URL, which runs on Google's own
# hardware and network.
#
# Needs Chrome installed and `jq`; Lighthouse itself is fetched on demand by
# `bunx`. The JSON report goes to a temp file, never into the repo.

set -euo pipefail

URL="${1:-}"
if [ -z "$URL" ] || [ "${URL#-}" != "$URL" ]; then
	echo "usage: scripts/audit.sh <url> [--desktop]" >&2
	exit 2
fi
shift

FORM_FACTOR="mobile"
LH_ARGS=(--form-factor=mobile --screenEmulation.mobile)
for arg in "$@"; do
	case "$arg" in
		--desktop)
			FORM_FACTOR="desktop"
			LH_ARGS=(--preset=desktop)
			;;
		*)
			echo "unknown option: $arg (expected --desktop)" >&2
			exit 2
			;;
	esac
done

command -v jq >/dev/null || {
	echo "jq is required (brew install jq)" >&2
	exit 1
}

REPORT="$(mktemp -t yns-lighthouse)"
trap 'rm -f "$REPORT"' EXIT

# Lighthouse writes a report even for a failed navigation, and its
# `runtimeError` says far more than the exit code does — prefer it.
bail() {
	local detail
	detail="$(jq -r '.runtimeError | "\(.code // "?"): \(.message // "")"' "$REPORT" 2>/dev/null || true)"
	echo "Lighthouse failed on $URL." >&2
	if [ -n "$detail" ] && [ "$detail" != "null: " ]; then
		echo "  $detail" >&2
		echo "  Check that the URL is reachable (curl it) and that Chrome is installed." >&2
	else
		head -c 1000 "$REPORT" >&2
		echo >&2
	fi
	exit 1
}

echo "Auditing $URL ($FORM_FACTOR)…" >&2
bunx lighthouse "$URL" \
	--only-categories=performance,accessibility \
	"${LH_ARGS[@]}" \
	--throttling-method=simulate \
	--chrome-flags="--headless=new" \
	--output=json \
	--output-path=stdout \
	--quiet >"$REPORT" || bail

jq -e 'has("categories") and (.runtimeError | not)' "$REPORT" >/dev/null 2>&1 || bail

jq -r '
	def pct: if . == null then "n/a" else (. * 100 | round | tostring) end;
	def trunc($n): tostring | gsub("\\s+"; " ") | if length > $n then .[0:$n] + "…" else . end;
	# Every url-ish string anywhere inside an audit’s details.
	def urls: [.. | objects | .url? | select(type == "string")] | unique;
	# What identifies a failing element, whichever shape the audit used.
	def node_label: .node.selector // .node.snippet // .selector // .snippet // .url // "(no node)";

	"URL: \(.finalDisplayedUrl // .requestedUrl // "?")",
	"Form factor: \(.configSettings.formFactor // "?")   Lighthouse \(.lighthouseVersion // "?")",
	"",
	"Scores",
	"  performance    \(.categories.performance.score | pct)",
	"  accessibility  \(.categories.accessibility.score | pct)",
	"",
	"Metrics (simulated — ±0.3 s run to run)",
	(["first-contentful-paint", "largest-contentful-paint", "total-blocking-time"][] as $id
		| .audits[$id] // empty
		| "  \(.title): \(.displayValue // "n/a")"),
	"",
	"Accessibility failures",
	(
		(.categories.accessibility.auditRefs | map(.id)) as $ids
		| . as $lhr
		| [$ids[] | $lhr.audits[.] | select(. != null and .score != null and .score < 1)]
		| if length == 0 then "  none — every scored accessibility audit passes"
			else
				.[]
				| "  ✗ \(.id) (\(.score | pct)) — \(.title)",
					((.details.items // [])[0:3][] | "      · \(node_label | trunc(140))")
			end
	),
	"",
	"Performance insights",
	(
		. as $lhr
		# Lighthouse 13 suffixes some insight ids with "-insight"; accept both.
		| ["render-blocking-insight", "lcp-breakdown", "network-dependency-tree"][] as $name
		| [$lhr.audits[$name], $lhr.audits["\($name)-insight"]]
		| map(select(. != null))
		| first // empty
		| "  \(.id) — \(.title)\(if (.displayValue // "") == "" then "" else ": \(.displayValue)" end)",
			(urls[0:3][] | "      · \(trunc(140))")
	)
' "$REPORT"
