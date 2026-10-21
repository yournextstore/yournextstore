import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards. Thin categories are topped
// up from the whole catalogue so the band always has a row.
async function getRelatedPool(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const [inCategory, everything] = await Promise.all([
		categorySlug
			? commerce.productBrowse({ active: true, limit: 8, category: categorySlug }).then((r) => r.data)
			: Promise.resolve([]),
		commerce.productBrowse({ active: true, limit: 12 }).then((r) => r.data),
	]);
	const ids = new Set(inCategory.map((p) => p.id));
	return [...inCategory, ...everything.filter((p) => !ids.has(p.id))];
}

/**
 * The original's tinted band: the page's pastel ground, rounded on top, four cards across.
 * No Suspense of its own: the read is cached and resolves with the page, so the band never
 * streams in late and pushes the footer down.
 */
export async function RelatedProducts({
	productId,
	categorySlug,
	background,
}: {
	productId: string;
	categorySlug?: string;
	background: string;
}) {
	const products = await getRelatedPool(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 4);

	if (related.length === 0) return null;

	return (
		// Card captions use a deeper grey here: the original #757575 would not clear AA on the pastels.
		<section
			className="-mb-5 rounded-t-xl px-4 pt-8 pb-14 md:px-8 [&_.text-darkgray]:text-[#4f4f4f]"
			style={{ background }}
		>
			<h2 className="mb-6 text-ui-lg font-bold md:text-ui-xl">Related products</h2>
			<div className="grid grid-cols-2 gap-3 pb-6 md:grid-cols-4">
				{related.map((product) => (
					<ProductCard key={product.id} product={product} sizes="(max-width: 768px) 50vw, 25vw" />
				))}
			</div>
		</section>
	);
}
