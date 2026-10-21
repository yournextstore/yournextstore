import { cacheLife } from "next/cache";
import { SectionHead } from "@/components/home-sections";
import { ProductCard } from "@/components/product-card";
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

/** "You may also like": four cards from the same category, topped up from the catalog. */
export async function RelatedProducts({
	productId,
	category,
}: {
	productId: string;
	category?: { slug: string; name: string } | null;
}) {
	const [same, all] = await Promise.all([
		category ? getCategoryProducts(category.slug) : Promise.resolve([]),
		getCategoryProducts(),
	]);
	const seen = new Set([productId]);
	const related = [...same, ...all]
		.filter((p) => {
			if (seen.has(p.id)) return false;
			seen.add(p.id);
			return true;
		})
		.slice(0, 4);

	if (related.length === 0) return null;

	return (
		<section className="section">
			<SectionHead
				title="You may also like"
				href={category ? `/category/${category.slug}` : "/products"}
				linkLabel={category ? `More ${category.name.toLowerCase()}` : "All products"}
			/>
			<div className="product-grid related-grid">
				{related.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
