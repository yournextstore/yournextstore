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

// No Suspense boundary of its own: the browse is cached, so it lands together with the rest of
// the product page instead of streaming in under the footer and pushing it (CLS).
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 5);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			title="Related Items"
			products={related}
			viewAllHref={categorySlug ? `/category/${categorySlug}` : "/products"}
		/>
	);
}
