#!/usr/bin/env bash
# main ed86ef3 (November 2026) let a grid below the fold opt out of loading its first
# card's image eagerly. Rewrites each given file the way that commit rewrote
# components/sections/product-grid.tsx: the `eagerFirstImage` prop, its default and the
# card's `priority`. Only a file that declares `ProductGridProps`, sets
# `priority={index === 0}` and has no `eagerFirstImage` yet is touched; a theme that
# shapes its grid differently is left for the agent.
exec perl -0pi -e '
	next unless /\btype ProductGridProps = \{/ && /priority=\{index === 0\}/ && !/\beagerFirstImage\b/;
	s/^(type ProductGridProps = \{\n(?:\t[^\n]*\n)*?)(\};)/$1\t\/** Load the first card\x27s image eagerly. Off for grids below the fold (related products). *\/\n\teagerFirstImage?: boolean;\n$2/m;
	s/^(export async function ProductGrid\(\{\n(?:\t[^\n]*\n)*?)(\}: ProductGridProps\))/$1\teagerFirstImage = true,\n$2/m;
	s/priority=\{index === 0\}/priority={eagerFirstImage && index === 0}/g;
' "$@"
