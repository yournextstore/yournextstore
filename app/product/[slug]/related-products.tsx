import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one browse.
async function getRailProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const [inSection, everything] = await Promise.all([
		categorySlug
			? commerce.productBrowse({ active: true, limit: 9, category: categorySlug }).catch(() => ({ data: [] }))
			: Promise.resolve({ data: [] }),
		commerce.productBrowse({ active: true, limit: 12 }).catch(() => ({ data: [] })),
	]);
	const others = everything.data.filter((product) => product.category?.slug !== categorySlug);
	return { inSection: inSection.data, others };
}

/**
 * "Wear it with": four pieces from other sections first, so the rail suggests what goes with
 * this one; the same section fills the gaps. Rendered without its own Suspense boundary (it
 * would land after the footer has painted and push it).
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const { inSection, others } = await getRailProducts(categorySlug);
	const rail = [...others, ...inSection].filter((product) => product.id !== productId).slice(0, 4);
	if (rail.length === 0) return null;

	return (
		<section className="flex flex-col gap-7 pt-20 lg:pt-28">
			<h2 className="font-display text-[48px] leading-[0.9] lg:text-[min(120px,8.3vw)] lg:leading-[0.85]">
				Wear it with
			</h2>
			<div className="grid grid-cols-2 gap-x-2.5 gap-y-[18px] lg:grid-cols-4 lg:gap-4">
				{rail.map((product) => (
					<ProductCard key={product.id} product={product} meta={null} />
				))}
			</div>
		</section>
	);
}
