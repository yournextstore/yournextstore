import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { Carousel, CarouselItem } from "@/components/carousel";
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
		<Carousel
			label="You may also like"
			align="start"
			heading={<h2 className="text-heading-md">You may also like</h2>}
			className="mt-20 lg:mt-28"
		>
			{related.map((product) => (
				<CarouselItem key={product.id}>
					<ProductCard product={product} />
				</CarouselItem>
			))}
		</Carousel>
	);
}
