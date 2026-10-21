import { cacheLife } from "next/cache";
import { Carousel } from "@/components/carousel";
import { ProductCard } from "@/components/product-card";
import { ArrowLink, SectionHeader } from "@/components/section-header";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one browse,
// and the current product is filtered out afterwards. A thin category is topped up with the
// newest products so the swimlane always has something to scroll.
async function getRelated(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const [inCategory, newest] = await Promise.all([
		categorySlug
			? commerce.productBrowse({ active: true, limit: 8, category: categorySlug }).catch(() => ({ data: [] }))
			: Promise.resolve({ data: [] }),
		commerce
			.productBrowse({ active: true, limit: 10, orderBy: "createdAt", orderDirection: "desc" })
			.catch(() => ({ data: [] })),
	]);
	return [...new Map([...inCategory.data, ...newest.data].map((p) => [p.id, p])).values()];
}

/**
 * "YOU MAY ALSO LIKE": the original's featured-products swimlane under the product. Rendered
 * without its own Suspense boundary (inside the page's): a nested one streams in after the
 * footer and shifts it.
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getRelated(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 9);

	if (related.length === 0) return null;

	return (
		<section className="mt-16 md:mt-24">
			<SectionHeader
				title="You may also like"
				subtitle="More linen you might like."
				action={<ArrowLink href="/products" />}
				className="mb-8 md:mb-10"
				size="h4"
			/>
			<Carousel label="related products">
				{related.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</Carousel>
		</section>
	);
}
