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
		limit: 7,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

// No Suspense of its own: it renders inside the product page's boundary, so it cannot stream in
// after the footer has painted and push it down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 6);

	if (related.length === 0) return null;

	return (
		<div className="border-t border-border">
			<ProductGrid eyebrow="More to explore" title="You may also like" products={related.slice(0, 4)} />
		</div>
	);
}
