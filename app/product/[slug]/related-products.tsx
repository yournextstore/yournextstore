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
		limit: 9,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

async function getFallbackProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 9 });
	return data;
}

// No Suspense of its own: it renders inside the page's boundary, so it never lands after the
// footer has painted (layout shift).
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const [inCategory, fallback] = await Promise.all([
		getCategoryProducts(categorySlug),
		getFallbackProducts(),
	]);
	const pool = [...inCategory, ...fallback.filter((p) => !inCategory.some((c) => c.id === p.id))];
	const related = pool.filter((p) => p.id !== productId).slice(0, 4);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			title="You may also like"
			description=""
			products={related}
			showViewAll={false}
			dense
			className="pt-0 sm:pt-4"
		/>
	);
}
