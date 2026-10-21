import { cacheLife } from "next/cache";
import { DisplaySmall } from "@/components/jam/display";
import { commerce } from "@/lib/commerce";
import { pickVisuallyDistinct } from "@/lib/display";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards. Topped up from the whole
// catalogue so a small category still fills the row.
async function getRelatedPool(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const [inCategory, everything] = await Promise.all([
		categorySlug
			? commerce
					.productBrowse({ active: true, limit: 12, category: categorySlug })
					.then((r) => r.data)
					.catch(() => [])
			: Promise.resolve([]),
		commerce
			.productBrowse({ active: true, limit: 24 })
			.then((r) => r.data)
			.catch(() => []),
	]);
	return [...inCategory, ...everything.filter((p) => !inCategory.some((c) => c.id === p.id))];
}

/** "You may also like" in the original's Trending Now tiles. No Suspense of its own: it renders
 *  inside the page's boundary so it cannot push the footer after first paint. */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const pool = await getRelatedPool(categorySlug);
	const related = pickVisuallyDistinct(
		pool.filter((p) => p.id !== productId),
		4,
	);

	if (related.length === 0) return null;

	return (
		<section aria-labelledby="related-heading" className="pt-10">
			<div className="flex flex-col items-center pb-6 text-center">
				<h2 id="related-heading" className="mb-3 text-4xl text-foreground">
					You may also like
				</h2>
				<p className="text-sm text-muted-foreground">More pieces from the shop.</p>
			</div>
			<div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
				{related.map((product) => (
					<DisplaySmall
						key={product.id}
						href={`/product/${product.slug}`}
						title={product.name}
						subtitle={product.category?.name.toLowerCase() ?? ""}
						image={product.images[0] ?? null}
					/>
				))}
			</div>
		</section>
	);
}
