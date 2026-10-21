import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { rowCardClass } from "@/components/sections/home";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 6,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

async function getFallbackProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 6 });
	return data;
}

/**
 * Original "Related Books" row. Rendered without its own Suspense boundary: it streams
 * with the page, so it can't land after the footer and push it (CLS).
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const inCategory = (await getCategoryProducts(categorySlug)).filter((p) => p.id !== productId);
	const related = (
		inCategory.length >= 2 ? inCategory : (await getFallbackProducts()).filter((p) => p.id !== productId)
	).slice(0, 5);

	if (related.length === 0) return null;

	return (
		<section className="py-8 md:py-10">
			<h2 className="font-serif text-2xl font-medium">You May Also Like</h2>
			<div className="shelf-grid my-4">
				{related.map((product, index) => (
					<ProductCard key={product.id} product={product} className={rowCardClass(index, related.length)} />
				))}
			</div>
		</section>
	);
}
