import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { productGridClass } from "@/components/product-grid-skeleton";
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

/** Rendered inside the page's own Suspense: a nested boundary here would land after the footer. */
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
		<section aria-labelledby="related-heading" className="mt-14 space-y-5">
			<h2 id="related-heading" className="leading-[1.1] font-semibold md:text-xl">
				You may also like
			</h2>
			<div className={productGridClass}>
				{related.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
