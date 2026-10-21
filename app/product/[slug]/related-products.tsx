import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
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

// Rendered inside the page's own Suspense boundary, without one of its own: a nested boundary
// below the details streams in after the footer has painted and pushes it down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 8);

	if (related.length === 0) return null;

	return (
		<section aria-labelledby="related-heading" className="mx-auto max-w-[56rem] px-8 pb-16 sm:px-6">
			<h2 id="related-heading" className="mb-8 text-center text-2xl font-semibold text-black md:text-left">
				You may also like
			</h2>
			<div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
				{related.slice(0, 3).map((product) => (
					<ProductCard key={product.id} product={product} sizes="(max-width: 640px) 90vw, 280px" />
				))}
			</div>
		</section>
	);
}
