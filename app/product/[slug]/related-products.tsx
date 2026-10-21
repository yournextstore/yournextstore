import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { Carousel } from "@/components/carousel";
import { ProductCard } from "@/components/product-card";
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

export function RelatedProducts(props: { productId: string; categorySlug?: string }) {
	return (
		<Suspense>
			<RelatedProductsContent {...props} />
		</Suspense>
	);
}

/** "You may also like": the original's Italiana heading over the product carousel. */
async function RelatedProductsContent({
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
		<section className="mt-20 lg:mt-28">
			<h2 className="mb-6 font-display text-display-md sm:mb-8">You may also like</h2>
			<Carousel label="You may also like">
				{related.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						className="w-[78%] shrink-0 snap-start sm:w-[calc((100%-1rem)/2)] md:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3.75rem)/4)]"
						sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
					/>
				))}
			</Carousel>
		</section>
	);
}
