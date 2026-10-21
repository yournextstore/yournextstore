import { cacheLife } from "next/cache";
import { RailSection } from "@/components/sections/frntr";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const [inCategory, latest] = await Promise.all([
		categorySlug
			? commerce.productBrowse({ active: true, limit: 10, category: categorySlug })
			: Promise.resolve({ data: [] }),
		commerce.productBrowse({ active: true, limit: 10 }),
	]);
	return [...inCategory.data, ...latest.data];
}

// No Suspense of its own: it renders inside the page's boundary, so it cannot stream in after
// the footer has painted and push it down.
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products
		.filter((p, index, list) => p.id !== productId && list.findIndex((q) => q.id === p.id) === index)
		.slice(0, 9);

	if (related.length === 0) return null;

	return (
		<RailSection
			framed={false}
			title="You might also like"
			text="More pieces that look good together."
			products={related}
		/>
	);
}
