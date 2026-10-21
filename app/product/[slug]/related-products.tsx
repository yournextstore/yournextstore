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
		limit: 11,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

async function getFallbackProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 11 });
	return data;
}

/**
 * The original's "Similar products" grid. Rendered without its own Suspense boundary: it streams with
 * the product page, so it cannot land after the footer has painted and push it down.
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const inCategory = (await getCategoryProducts(categorySlug)).filter((p) => p.id !== productId);
	const related =
		inCategory.length >= 5
			? inCategory
			: [
					...inCategory,
					...(await getFallbackProducts()).filter(
						(p) => p.id !== productId && !inCategory.some((q) => q.id === p.id),
					),
				];

	if (related.length === 0) return null;

	return (
		<ProductGrid
			title="Similar products"
			products={related.slice(0, 10)}
			showViewAll={false}
			className="frame pt-14 pb-6"
		/>
	);
}
