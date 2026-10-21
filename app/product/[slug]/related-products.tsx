import { cacheLife } from "next/cache";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";

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

// No Suspense boundary of its own: it renders inside the product page's boundary, so it
// lands with the details instead of streaming in later and pushing the footer down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 4);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			eyebrow="From the same shelf"
			title="You may also like."
			products={related}
			viewAllHref={categorySlug ? `/category/${categorySlug}` : "/products"}
			viewAllLabel="See them all"
			className="mt-16 border-t pt-12 md:mt-20"
		/>
	);
}
