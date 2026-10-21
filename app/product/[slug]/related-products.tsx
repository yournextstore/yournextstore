import { cacheLife } from "next/cache";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";
import { pickVisuallyDistinct } from "@/lib/display";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards. Topped up from the whole
// catalogue so a small category still fills the row of four.
async function getRecommendations(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const [inCategory, all] = await Promise.all([
		categorySlug ? commerce.productBrowse({ active: true, limit: 5, category: categorySlug }) : null,
		commerce.productBrowse({ active: true, limit: 9 }),
	]);
	const seen = new Set<string>();
	return [...(inCategory?.data ?? []), ...all.data].filter((p) => !seen.has(p.id) && Boolean(seen.add(p.id)));
}

// No Suspense of its own: it renders inside the page's boundary, so it can't stream in
// after the footer has painted and push it down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getRecommendations(categorySlug);
	const related = pickVisuallyDistinct(
		products.filter((p) => p.id !== productId),
		4,
	);
	if (related.length === 0) return null;
	return <ProductGrid title="We Think You'll Love" heading="centered" products={related} className="mt-0" />;
}
