import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { cn } from "@/lib/utils";

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

/** The original's "Related" column. Rendered inside the page's Suspense, never its own (CLS). */
export async function RelatedProducts({
	productId,
	categorySlug,
	wide,
}: {
	productId: string;
	categorySlug?: string;
	wide: boolean;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, wide ? 4 : 2);

	if (related.length === 0) return null;

	return (
		<section aria-labelledby="related-heading" className={cn(wide ? "w-full" : "lg:basis-1/2")}>
			<h2 id="related-heading" className="font-medium text-lg uppercase">
				Related
			</h2>
			<div
				className={cn("grid grid-cols-2 gap-x-5 gap-y-10 py-5 lg:gap-12 lg:pr-5", wide && "lg:grid-cols-4")}
			>
				{related.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
