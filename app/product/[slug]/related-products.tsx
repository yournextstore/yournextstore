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
		limit: 6,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

// No Suspense boundary of its own: it renders inside the page's boundary, so it lands with
// the details instead of streaming in after the footer has painted (CLS).
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const inCategory = (await getCategoryProducts(categorySlug)).filter((p) => p.id !== productId);
	// A one-product category leaves nothing to suggest: fall back to the newest pieces in the shop.
	const products =
		inCategory.length >= 2 || !categorySlug
			? inCategory
			: [...inCategory, ...(await getCategoryProducts()).filter((p) => p.id !== productId)];
	const related = [...new Map(products.map((p) => [p.id, p])).values()].slice(0, 5);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			title="You may also like"
			description="More to discover"
			products={related}
			showViewAll={false}
		/>
	);
}
