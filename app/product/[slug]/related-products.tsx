import { cacheLife } from "next/cache";
import { ProductGrid } from "@/components/sections/product-grid";
import { getCatalogProducts } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 5,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

async function getFallbackProducts() {
	const { products } = await getCatalogProducts();
	return products.slice(0, 5);
}

/**
 * "You May Also Like": four from the same category, topped up from the catalogue. Rendered
 * without a Suspense boundary of its own (it lands with the page, so the footer never jumps).
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const [inCategory, fallback] = await Promise.all([
		getCategoryProducts(categorySlug),
		getFallbackProducts(),
	]);
	const pictured = (p: (typeof inCategory)[number]) => (p.images?.length ?? 0) > 0;
	const related = [...inCategory.filter(pictured), ...fallback]
		.filter((p, i, all) => p.id !== productId && all.findIndex((q) => q.id === p.id) === i)
		.slice(0, 4);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			eyebrow="You May Also Like"
			title="Related Products"
			products={related}
			showViewAll={false}
			align="start"
			className="mt-12 px-0 pb-0 lg:mt-24 lg:px-0 lg:pb-0"
		/>
	);
}
