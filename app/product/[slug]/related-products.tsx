import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { ProductRail } from "@/components/product-rail";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 10,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

/**
 * "HIGHLY RECOMMENDED" carousel. No Suspense of its own: it renders inside the page's boundary,
 * so it lands with the details instead of pushing the footer after first paint.
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 9);

	if (related.length === 0) return null;

	return (
		<section aria-labelledby="recommended" className="mx-auto max-w-[66rem] px-4 pt-16 pb-20 sm:px-6">
			<ProductRail
				label="Recommended products"
				tabs={[
					{
						key: "related",
						label: "Highly recommended",
						items: related.map((product) => <ProductCard key={product.id} product={product} />),
					},
				]}
				heading={
					<h2 id="recommended" className="section-title text-[2rem] text-ink lg:text-heading-xl">
						Highly <span className="stroke-word">Recommended</span>
					</h2>
				}
			/>
		</section>
	);
}
