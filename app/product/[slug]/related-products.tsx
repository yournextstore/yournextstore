import { cacheLife } from "next/cache";
import { TrendingCard } from "@/components/trending-card";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 8,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

/**
 * More from the same category, in the home page's trending-card style. No Suspense of its own:
 * it renders inside the page's boundary so it cannot stream in late and push the footer.
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 7);

	if (related.length === 0) return null;

	return (
		<section className="mt-10 grid grid-cols-1 gap-4 py-4 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			<h2 className="flex items-center text-3xl break-words md:text-4xl">You may also like</h2>
			{related.map((product) => (
				<TrendingCard key={product.id} product={product} />
			))}
		</section>
	);
}
