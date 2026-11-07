#!/usr/bin/env bash
# main 8b04951 (November 2026) prerenders the home page: the featured grid is
# "use cache", so it renders without a <Suspense> boundary or a skeleton. Together
# with ef09fcb (the home page's own canonical) and d843f3a (the skeleton refactor
# 8b04951 then deleted), this rewrites each given home page the way main did:
# - unwraps a <Suspense fallback={<Skeleton />}> that holds only a <ProductGrid … />,
#   with main's comment, and deletes that skeleton function once nothing renders it;
# - drops the Suspense and ProductGridSkeleton imports left unused;
# - adds `metadata` with the "/" canonical where the page has no metadata of its own.
# Only a file with `export default function Home(` is touched; Biome then sorts the
# imports, which reproduces main's app/page.tsx from any of those commits' parents.
exec perl -0pi -e '
	next unless /^export default function Home\(/m;
	my $note = "{/* No <Suspense>: the grid is \"use cache\", so it renders into the prerendered shell in document order. A boundary\n";
	my %fallback;
	s~^(\t+)<Suspense fallback=\{<(\w+) ?/>\}>\n\t+(<ProductGrid\b[^<>]*/>)\n\t+</Suspense>\n~
		$fallback{$2} = 1;
		"$1$note$1    around cached data still ships the skeleton first and the content later in the HTML. */}\n$1$3\n"
	~gme;
	for my $name (keys %fallback) {
		my @uses = /<\Q$name\E\b/g;
		s/^function \Q$name\E\(\) \{\n.*?^\}\n\n//ms unless @uses;
	}
	# The note itself names <Suspense>; it is not a use.
	s/^import \{ Suspense \} from "react";\n//m unless /<Suspense\b(?!>: the grid)/;
	s/^import \{ ProductGridSkeleton \} from "[^"]*";\n//m unless /<ProductGridSkeleton\b/;
	unless (/\bexport (?:const metadata\b|(?:async )?function generateMetadata\b)/) {
		s/^(export default function Home\()/export const metadata: Metadata = {\n\talternates: { canonical: "\/" },\n};\n\n$1/m;
		s/^/import type { Metadata } from "next";\n/ unless /\bimport type \{[^}]*\bMetadata\b[^}]*\} from "next";/;
	}
' "$@"
