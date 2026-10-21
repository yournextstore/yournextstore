import { cacheLife } from "next/cache";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards. Thin categories are topped up
// from the whole catalogue so the row is never a lone card.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const [inCategory, everything] = await Promise.all([
		categorySlug
			? commerce.productBrowse({ active: true, limit: 5, category: categorySlug }).then((r) => r.data)
			: Promise.resolve([]),
		commerce.productBrowse({ active: true, limit: 9 }).then((r) => r.data),
	]);
	const seen = new Set<string>();
	return [...inCategory, ...everything].filter((product) => {
		if (seen.has(product.id)) return false;
		seen.add(product.id);
		return true;
	});
}

// No Suspense of its own: a nested boundary streams in after the footer has painted and pushes it.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 4);

	if (related.length === 0) return null;

	return <ProductGrid title="You may also like" products={related} showViewAll={false} />;
}
