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

// No Suspense of its own: it renders inside the page's boundary, so it cannot land after the
// footer has painted and push it down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const [inCategory, catalogue] = await Promise.all([
		getCategoryProducts(categorySlug),
		getCategoryProducts(),
	]);
	const pictured = (p: (typeof catalogue)[number]) =>
		(p.images?.length ?? 0) > 0 && p.variants.some((v) => Number(v.price) > 0);
	// Same category first, topped up from the catalogue so the row is always full.
	const related = [...inCategory.filter(pictured), ...catalogue.filter(pictured)]
		.filter((p, i, all) => p.id !== productId && all.findIndex((q) => q.id === p.id) === i)
		.slice(0, 3);

	if (related.length === 0) return null;

	return (
		<section aria-labelledby="related-title" className="mt-16 border-t border-line pt-10 sm:mt-24">
			<p className="hs-kicker mb-3">[ Also in the catalogue ]</p>
			<h2 id="related-title" className="hs-display hs-h3 mb-7">
				Pairs well with.
			</h2>
			<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
				{related.map((product, index) => (
					// Two columns below lg: the third card would sit alone, so it waits for the wide grid.
					<div key={product.id} className={index === 2 ? "hidden lg:grid" : "grid"}>
						<ProductCard product={product} index={index} />
					</div>
				))}
			</div>
		</section>
	);
}
