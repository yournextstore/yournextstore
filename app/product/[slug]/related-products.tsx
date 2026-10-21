import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { picturedFirst } from "@/lib/catalog";
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

/**
 * The original's "More products from …" row: a horizontally scrolling strip of cards.
 * Rendered without its own Suspense boundary, inside the page's, so it never lands after
 * the footer has painted (layout shift).
 */
export async function RelatedProducts({
	productId,
	categorySlug,
	categoryName,
}: {
	productId: string;
	categorySlug?: string;
	categoryName?: string;
}) {
	const inCategory = (await getCategoryProducts(categorySlug)).filter((p) => p.id !== productId);
	// A thin category (one or two other products) falls back to the whole catalogue.
	const useCategory = !categorySlug || inCategory.length >= 3;
	const pool = useCategory ? inCategory : (await getCategoryProducts()).filter((p) => p.id !== productId);
	const related = picturedFirst(pool).slice(0, 8);
	const heading = useCategory && categoryName ? `More products from ${categoryName}` : "More products";

	if (related.length === 0) return null;

	return (
		<section className="min-w-0 space-y-6 overflow-hidden">
			<h2 className="line-clamp-1 font-heading text-2xl">{heading}</h2>
			<div className="-mx-4 flex snap-x scroll-px-4 gap-4 overflow-x-auto px-4 pb-3.5 sm:mx-0 sm:scroll-px-0 sm:px-0">
				{related.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						className="w-[260px] min-w-[260px] shrink-0 snap-start"
					/>
				))}
			</div>
		</section>
	);
}
