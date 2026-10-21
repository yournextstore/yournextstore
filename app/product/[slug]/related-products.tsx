import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { inSentence } from "@/lib/aqua";
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
	categoryName,
}: {
	productId: string;
	categorySlug?: string;
	categoryName?: string;
}) {
	const related = (await getRelated(categorySlug)).filter((p) => p.id !== productId).slice(0, 8);
	if (related.length === 0) return null;

	return (
		<section className="py-14">
			<h2 className="mb-6 text-2xl font-normal">
				{categoryName ? `More ${inSentence(categoryName)}` : "You might also like"}
			</h2>
			<ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:-mx-8 md:scroll-px-8 md:px-8">
				{related.map((product) => (
					<li key={product.id} className="relative w-[64%] shrink-0 snap-start sm:w-[38%] lg:w-[22%]">
						<ProductCard product={product} heading="h3" sizes="(min-width: 1024px) 22vw, 60vw" />
					</li>
				))}
			</ul>
		</section>
	);
}
