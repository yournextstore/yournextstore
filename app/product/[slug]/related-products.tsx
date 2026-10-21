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
		limit: 7,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

/**
 * "You may also like": a rail of fifth-width cards. Rendered without its own Suspense
 * boundary so it arrives with the page and never pushes the footer after first paint.
 */
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
		<section aria-labelledby="related-heading" className="mt-16">
			<h2 id="related-heading" className="mb-4 text-3xl sm:text-4xl">
				You may also like
			</h2>
			<div className="no-scrollbar -mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 md:mx-0 md:px-0">
				{related.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						className="w-4/5 flex-none snap-start sm:w-2/5 md:w-[calc((100%-4rem)/5)]"
						sizes="(max-width: 720px) 80vw, (max-width: 960px) 40vw, 20vw"
					/>
				))}
			</div>
		</section>
	);
}
