import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { Rail } from "@/components/rail";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 9,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

// No Suspense of its own: the browse is cached, so it resolves with the product details instead of
// streaming in afterwards and pushing the newsletter band and footer down (CLS).
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 8);

	if (related.length === 0) return null;

	return (
		<div className="-mx-5 mt-16 md:-mx-10 md:mt-24">
			<Rail title="You may also like" centered>
				{related.map((product) => (
					<div key={product.id} className="w-[calc(50%-0.5rem)] shrink-0 snap-start md:w-[calc(25%-0.75rem)]">
						<ProductCard product={product} className="h-full" />
					</div>
				))}
			</Rail>
		</div>
	);
}
