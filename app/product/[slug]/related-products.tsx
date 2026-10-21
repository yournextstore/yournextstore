import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards. Falls back to the whole
// catalogue when the category is too small to fill the row.
async function getRelated(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const [inCategory, all] = await Promise.all([
		categorySlug
			? commerce.productBrowse({ active: true, limit: 8, category: categorySlug }).then((r) => r.data)
			: Promise.resolve([]),
		commerce.productBrowse({ active: true, limit: 12 }).then((r) => r.data),
	]);
	const seen = new Set(inCategory.map((p) => p.id));
	return [...inCategory, ...all.filter((p) => !seen.has(p.id))];
}

// No Suspense of its own: it renders inside the page's boundary, so it never streams in
// after the footer has painted (layout shift).
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const related = (await getRelated(categorySlug)).filter((p) => p.id !== productId).slice(0, 8);
	if (related.length === 0) return null;

	return (
		<section className="py-8">
			<h2 className="mb-4 text-2xl font-bold">Related Products</h2>
			<ul className="flex w-full gap-4 overflow-x-auto pt-1">
				{related.map((product) => (
					<li
						key={product.id}
						className="relative aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
					>
						<ProductCard
							product={product}
							heading="h3"
							sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
						/>
					</li>
				))}
			</ul>
		</section>
	);
}
