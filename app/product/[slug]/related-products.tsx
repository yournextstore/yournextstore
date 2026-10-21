import { cacheLife } from "next/cache";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";

// Cached per category: every product page in a category shares one browse, and the current
// product is filtered out afterwards. No Suspense boundary of its own: one would stream in
// after the footer and push it down (CLS).
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 7,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const [inCategory, everything] = await Promise.all([
		getCategoryProducts(categorySlug),
		getCategoryProducts(),
	]);
	const seen = new Set([productId]);
	const related = [...inCategory, ...everything].filter((p) => {
		if (seen.has(p.id)) return false;
		seen.add(p.id);
		return true;
	});

	if (related.length === 0) return null;

	return <ProductGrid title="Related Products" products={related.slice(0, 3)} showViewAll={false} />;
}
