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
		limit: 5,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

/**
 * "Find more like this": four plain cards under a centred heading. Rendered without its own
 * Suspense boundary on purpose: it streams with the page, so the footer never jumps.
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
		<section className="border-b border-border px-4 py-12 md:p-8 md:py-16 lg:py-20">
			<h2 className="mb-8 text-center text-h2">Find more like this</h2>
			<div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-8 lg:grid-cols-4">
				{related.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						headingLevel="h3"
						compact
						sizes="(max-width: 1024px) 50vw, 25vw"
					/>
				))}
			</div>
		</section>
	);
}
