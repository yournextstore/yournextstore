import { cacheLife } from "next/cache";
import { SectionHead, TextLink, tileGridClass } from "@/components/deckle";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { picturedFirst } from "@/lib/pictured";

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

async function getNewestProducts() {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productBrowse({ active: true, limit: 9 });
	return data;
}

/**
 * More pieces, four across. Rendered without a Suspense boundary of its own: inside the page's
 * boundary it arrives with the details, instead of streaming in after the footer and pushing it.
 */
export async function RelatedProducts({
	productId,
	categorySlug,
}: {
	productId: string;
	categorySlug?: string;
}) {
	const [inCategory, newest] = await Promise.all([getCategoryProducts(categorySlug), getNewestProducts()]);
	const related = [...picturedFirst(inCategory), ...picturedFirst(newest)]
		.filter((p, index, all) => p.id !== productId && all.findIndex((q) => q.id === p.id) === index)
		.slice(0, 4);

	if (related.length === 0) return null;

	return (
		<section aria-labelledby="more-title" className="band">
			<SectionHead
				id="more-title"
				title="More pieces"
				action={
					<TextLink href="/products" arrow>
						See all products
					</TextLink>
				}
			/>
			<ul className={tileGridClass}>
				{related.map((product) => (
					<li key={product.id}>
						<ProductCard product={product} />
					</li>
				))}
			</ul>
		</section>
	);
}
