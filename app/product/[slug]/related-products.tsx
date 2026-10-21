import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { Slider } from "@/components/slider";
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

// Rendered inside the page's own Suspense boundary, without one of its own: a nested boundary
// below the details streams in after the footer has painted and pushes it down.
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
		<section className="bp-container pb-12 md:pb-16">
			<h2 className="bp-h3 mb-8 text-center md:mb-10">You May Also Like</h2>
			<Slider label="You may also like">
				{related.map((product) => (
					<li
						key={product.id}
						className="w-[62%] shrink-0 snap-start xs:w-[44%] md:w-[calc((100%-3*1.25rem)/4)]"
					>
						<ProductCard product={product} sizes="(max-width: 768px) 62vw, 25vw" />
					</li>
				))}
			</Slider>
		</section>
	);
}
