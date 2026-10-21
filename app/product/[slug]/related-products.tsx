import { cacheLife } from "next/cache";
import { CatalogGrid } from "@/components/catalog";
import { picturedFirst } from "@/lib/catalog";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({
		active: true,
		limit: 12,
		...(categorySlug ? { category: categorySlug } : {}),
	});
	return data;
}

async function getFallbackProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 12 });
	return data;
}

export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const inCategory = picturedFirst(
		(await getCategoryProducts(categorySlug)).filter((p) => p.id !== productId),
	);
	// A thin category still gets a full row: top up from the newest products.
	const related =
		inCategory.length >= 4
			? inCategory.slice(0, 4)
			: [
					...inCategory,
					...picturedFirst(
						(await getFallbackProducts()).filter(
							(p) => p.id !== productId && !inCategory.some((c) => c.id === p.id),
						),
					),
				].slice(0, 4);

	if (related.length === 0) return null;

	return (
		<section className="mt-20 border-t border-line pt-12">
			<h2 className="eyebrow mb-8 text-faint">You may also like</h2>
			<CatalogGrid products={related} headingLevel="h3" columns={4} priority={false} />
		</section>
	);
}
