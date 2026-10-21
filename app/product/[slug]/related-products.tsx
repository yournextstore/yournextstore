import { cacheLife } from "next/cache";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { ProductCarousel } from "@/components/product-carousel";
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
		<section className="py-10 sm:py-14 lg:pt-20">
			<div className="mb-6 flex flex-wrap items-end justify-between gap-x-8 gap-y-6 lg:mb-8">
				<h2 className="text-2xl leading-none sm:text-3xl lg:text-4xl">Related products</h2>
				<Link
					href={categorySlug ? `/category/${categorySlug}` : "/products"}
					className="group mr-3 rounded-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
				>
					<span className="link-underline">Shop all</span>
				</Link>
			</div>
			<ProductCarousel label="Related products">
				{related.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</ProductCarousel>
		</section>
	);
}
