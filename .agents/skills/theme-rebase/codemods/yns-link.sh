#!/usr/bin/env bash
# main a6aca22 (August 2026) retired components/yns-link.tsx for plain next/link.
# Rewrites each given file the way that commit did: the import, the tag and the
# `prefetch="eager"` prop; Biome then sorts the import and rewraps the lines,
# which reproduces main's version of every file it touched. A file that sets
# `activeClassName` or `exactHrefMatch` is left alone: that styling needs a
# client component of its own (rules.md), which takes judgment.
exec perl -0pi -e '
	next unless /\bYnsLink\b/ && !/\b(?:activeClassName|exactHrefMatch)\b/;
	my $import = qr/^import \{ YnsLink \} from "[^"]*yns-link";\n/m;
	if (/from "next\/link"/) { s/$import// } else { s/$import/import Link from "next\/link";\n/ }
	s/<(\/?)YnsLink\b/<$1Link/g;
	s/\s+prefetch=(?:\{"eager"\}|"eager")//g;
' "$@"
