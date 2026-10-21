import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";
import { picturedFirst } from "@/lib/pictured";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 12,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

export function RelatedProducts(props: { productId: string; categorySlug?: string }) {
	return (
		<Suspense>
			<RelatedProductsContent {...props} />
		</Suspense>
	);
}

async function RelatedProductsContent({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	// Same-category picks first, topped up from the whole shop so the row is always a full four
	// (or an even two) instead of a lone tile.
	const [inCategory, everything] = await Promise.all([
		categorySlug ? getCategoryProducts(categorySlug) : Promise.resolve([]),
		getCategoryProducts(),
	]);
	const seen = new Set([productId]);
	const merged = [...picturedFirst(inCategory), ...picturedFirst(everything)].filter((p) => {
		if (seen.has(p.id)) return false;
		seen.add(p.id);
		return true;
	});
	const related = merged.slice(0, merged.length >= 4 ? 4 : merged.length - (merged.length % 2));

	if (related.length === 0) return null;

	return <ProductGrid title="Some other things you might like" products={related} />;
}
