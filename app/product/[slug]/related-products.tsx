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
 * "Similar items" in the original's list rows. Rendered without its own Suspense boundary:
 * it is cached, and a nested boundary below the details streams in late and shifts the footer.
 */
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
		<section aria-labelledby="similar-title" className="mt-14 border-t border-border pt-10 lg:mt-20">
			<h2 id="similar-title" className="mb-2 font-display text-heading-lg font-semibold leading-[1.15]">
				Similar items
			</h2>
			<div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
				{related.map((product) => (
					<ProductCard key={product.id} product={product} layout="list" />
				))}
			</div>
		</section>
	);
}
