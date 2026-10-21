import { cacheLife } from "next/cache";
import { ProductCarousel } from "@/components/sections/product-carousel";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 10,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

/**
 * "Complete the look": the product's category, topped up from the whole catalog when the
 * category is small. No Suspense of its own: it renders inside the page's boundary, so it
 * cannot stream in after the footer has painted and push it down.
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const [inCategory, everything] = await Promise.all([
		categorySlug ? getCategoryProducts(categorySlug) : Promise.resolve([]),
		getCategoryProducts(),
	]);
	const seen = new Set([productId]);
	const related = [...inCategory, ...everything]
		.filter((product) => {
			if (seen.has(product.id)) return false;
			seen.add(product.id);
			return true;
		})
		.slice(0, 8);

	return <ProductCarousel title="Complete the look" products={related} />;
}
