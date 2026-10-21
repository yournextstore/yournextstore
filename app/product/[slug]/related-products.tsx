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
		limit: 5,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

/**
 * "Pairs well with": four cards under the product. No Suspense of its own on purpose — it
 * renders inside the product page's boundary, so it never lands after the footer has painted.
 */
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

	return (
		<section aria-labelledby="related-heading" className="py-10 sm:py-14">
			<h2 id="related-heading" className="font-display text-2xl font-bold tracking-tight">
				Pairs well with
			</h2>
			<ProductGrid products={related} className="mt-6" />
		</section>
	);
}
