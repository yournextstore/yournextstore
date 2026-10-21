import { cacheLife } from "next/cache";
import { Carousel } from "@/components/mandala/carousel";
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

// No Suspense of its own: it renders inside the page's boundary, so it lands with the
// details instead of streaming in later and pushing the footer down.
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
		<section className="mt-24 border-t border-border pt-16">
			<h2 className="text-2xl font-bold leading-8 tracking-tight">You may also like</h2>
			<Carousel label="Related products" className="mt-6">
				{related.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 300px"
					/>
				))}
			</Carousel>
		</section>
	);
}
