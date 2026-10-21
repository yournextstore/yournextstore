import { cacheLife } from "next/cache";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 9,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

// No Suspense of its own: it renders inside the page's boundary, so it cannot stream in
// after the footer has painted and push it down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const inCategory = (await getCategoryProducts(categorySlug)).filter((p) => p.id !== productId);
	// A one-product category leaves nothing to suggest: fall back to the whole catalogue.
	const related = (
		inCategory.length > 0 || !categorySlug
			? inCategory
			: (await getCategoryProducts()).filter((p) => p.id !== productId)
	).slice(0, 4);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			kicker="Keep browsing"
			title="You might also like"
			products={related}
			showViewAll={false}
			className="border-t border-border px-0! md:px-0! lg:px-0!"
		/>
	);
}
