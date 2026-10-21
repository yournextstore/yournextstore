import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards. A category too small to fill
// the row tops up from the rest of the catalog.
async function getRelatedCandidates(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const [inCategory, everything] = await Promise.all([
		categorySlug
			? commerce.productBrowse({ active: true, limit: 4, category: categorySlug }).catch(() => ({ data: [] }))
			: Promise.resolve({ data: [] }),
		commerce.productBrowse({ active: true, limit: 8 }).catch(() => ({ data: [] })),
	]);
	const seen = new Set<string>();
	return [...inCategory.data, ...everything.data].filter((product) => {
		if (seen.has(product.id)) return false;
		seen.add(product.id);
		return true;
	});
}

export function RelatedProducts(props: { productId: string; categorySlug?: string }) {
	return (
		<Suspense>
			<RelatedProductsContent {...props} />
		</Suspense>
	);
}

async function RelatedProductsContent({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getRelatedCandidates(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 3);

	if (related.length === 0) return null;

	return (
		<section aria-labelledby="related-heading">
			<div className="layout">
				<h2
					id="related-heading"
					className="col-span-full mt-26 mb-8 text-title-md md:mt-36 md:mb-16 md:text-title-2xl"
				>
					Related products
				</h2>
			</div>
			<div className="layout gap-y-10 md:gap-y-16">
				{/* Two on phones (a full row), three from md. */}
				{related.map((product, index) => (
					<div
						key={product.id}
						className={index === 2 ? "col-span-6 max-md:hidden md:col-span-4" : "col-span-6 md:col-span-4"}
					>
						<ProductCard product={product} />
					</div>
				))}
			</div>
		</section>
	);
}
