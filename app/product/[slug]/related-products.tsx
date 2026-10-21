import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { SectionHeader } from "@/components/section-header";
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
 * "You May Also Like": four cards under a ruled divider. Rendered without its own Suspense
 * boundary (inside the page's): a nested one streams in after the footer and shifts it.
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
		<section className="mt-16 border-t border-border pt-16 md:mt-20 md:pt-20">
			<SectionHeader
				title="You May Also Like"
				subtitle="Curated pieces to complement your selection"
				className="mb-8 md:mb-12"
			/>
			<ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
				{related.map((product) => (
					<li key={product.id}>
						<ProductCard product={product} />
					</li>
				))}
			</ul>
		</section>
	);
}
