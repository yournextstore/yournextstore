#!/usr/bin/env bash
# main ff4c6a6 (November 2026) gives product cards a blurred image preview and prefetches
# on intent, and e402404 strikes through the regular price during a promotion. Rewrites a
# ProductCard still in the shape before ff4c6a6 the way those commits did:
# - the store config and the first image's preview load together, and the price lines
#   move below the images they now wait on;
# - the card's outer <Link> to the product becomes <IntentLink>;
# - the primary <YNSMedia> gets `preview={preview}`;
# - `compareAtDisplay` is computed and, where the price line still has main's markup,
#   shown struck through. A theme that styled its price line keeps it as it is; showing
#   the struck-through price there is the agent's call, in the theme's style.
# Only a file with `export async function ProductCard(` is touched, and each step only
# when its old shape is there.
exec perl -0pi -e '
	next unless /^export async function ProductCard\(/m;
	my $price = qr/\tconst listing = variants \? listingPrice\(variants, taxBehavior\) : null;\n\tconst priceDisplay = listing\n\t\t\? `\$\{listing\.from \? "From " : ""\}\$\{formatMoney\(\{ amount: listing\.amount, currency, locale \}\)\}`\n\t\t: null;\n/;
	my $compare = "\tconst compareAtDisplay = listing?.compareAt\n\t\t? formatMoney({ amount: listing.compareAt, currency, locale })\n\t\t: null;\n";
	if (s/^\tconst \{ currency, locale, taxBehavior \} = await getStoreConfig\(\);\n(\tconst variants = [^\n]*\n)($price)\n/$1/m) {
		my $lines = $2;
		s/^(\tconst secondaryImage = allImages\[1\];\n)/$1\tconst [{ currency, locale, taxBehavior }, preview] = await Promise.all([\n\t\tgetStoreConfig(),\n\t\tblurPreview(primaryImage),\n\t]);\n$lines$compare/m;
		s/^(\t+<YNSMedia\n(\t+)src=\{primaryImage\}\n)(?!\t+preview=)/$1$2preview={preview}\n/m;
		s/^import \{ formatMoney \}/import { blurPreview } from "\@\/lib\/blur-placeholder";\nimport { formatMoney }/m;
		if (s/^(\t\t)<Link (href=\{`\/product\/\$\{product\.slug\}\$\{variantSearch\}`\})/$1<IntentLink $2/m) {
			s/^(\t\t)<\/Link>\n(\t\);\n\}\n?\z)/$1<\/IntentLink>\n$2/m;
			s/^import Link from "next\/link";\n/import { IntentLink } from "\@\/components\/intent-link";\n/m unless /<Link\b/;
			s/^(import \{ formatMoney \})/import { IntentLink } from "\@\/components\/intent-link";\n$1/m unless /\bimport \{ IntentLink \}/;
		}
	}
	if (/\bconst priceDisplay = listing\n/ && !/\bcompareAtDisplay\b/ && /\bblurPreview\(primaryImage\)/) {
		s/^($price)/$1$compare/m;
	}
	s/^(\t+)<p className="text-base font-semibold text-foreground">\{priceDisplay\}<\/p>\n/$1<p className="flex flex-wrap items-baseline gap-2">\n$1\t<span className="text-base font-semibold text-foreground">{priceDisplay}<\/span>\n$1\t{compareAtDisplay && (\n$1\t\t<span className="text-sm text-muted-foreground line-through">{compareAtDisplay}<\/span>\n$1\t)}\n$1<\/p>\n/m if /\bcompareAtDisplay\b/;
' "$@"
