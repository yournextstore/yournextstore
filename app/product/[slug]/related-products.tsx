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
		limit: 7,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

// No Suspense of its own: rendered inside the page's boundary, so it lands with the details
// instead of streaming in after the footer has painted and pushing it down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	// A small category tops up from the whole catalog so the row always has three cards.
	const [inCategory, everything] = await Promise.all([
		getCategoryProducts(categorySlug),
		categorySlug ? getCategoryProducts(undefined) : Promise.resolve([]),
	]);
	const related = [...inCategory, ...everything]
		.filter((p, index, all) => p.id !== productId && all.findIndex((q) => q.id === p.id) === index)
		.slice(0, 3);

	if (related.length === 0) return null;

	return <ProductGrid title="You may also like" products={related} showViewAll={false} />;
}
