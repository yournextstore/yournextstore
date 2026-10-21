import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { Rail } from "@/components/rail";
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

// No Suspense of its own: it renders inside the product page's boundary, so it lands with the
// details instead of streaming in after the footer has painted (PLAYBOOK §4).
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const products = await getCategoryProducts(categorySlug);
	const related = products.filter((p) => p.id !== productId).slice(0, 8);

	if (related.length === 0) return null;

	return (
		<section className="border-t border-border">
			<div className="shell py-16 lg:py-24">
				<Rail
					label="related products"
					heading={
						<h2 className="text-[2rem] leading-none font-medium sm:text-4xl xl:text-[2.5rem]">
							You may also <em>like</em>
						</h2>
					}
					description="More from the same shelf, picked to go with this one."
				>
					{related.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</Rail>
			</div>
		</section>
	);
}
