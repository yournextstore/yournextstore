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
		limit: 11,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

/**
 * The original's "You Might Also Like": one sideways-scrolling row of cards. Rendered without
 * its own Suspense boundary (inside the page's), so it lands with the details instead of
 * pushing the footer after first paint.
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 10);

	if (related.length === 0) return null;

	return (
		<section aria-labelledby="related-products" className="flex flex-col gap-6">
			<h2 id="related-products" className="text-2xl font-medium">
				You might also like
			</h2>
			<div className="-mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 md:-mx-6 md:scroll-px-6 md:px-6 xl:mx-0 xl:scroll-px-0 xl:px-0">
				{related.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						headingLevel="h3"
						className="w-[62vw] max-w-[326px] shrink-0 snap-start sm:w-[326px]"
					/>
				))}
			</div>
		</section>
	);
}
