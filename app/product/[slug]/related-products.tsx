import { cacheLife } from "next/cache";
import { ProductGrid } from "@/components/sections/product-grid";
import { tagKinds } from "@/lib/cache-tags";
import { commerce } from "@/lib/commerce";

// The merchant's suggested products first, then the same category. The platform picks the
// order and leaves out the product itself and anything a shopper can't buy right now.
async function getRelatedProducts(productId: string) {
	"use cache";
	tagKinds("product");
	cacheLife("hours");
	const { data } = await commerce.productRelated({ idOrSlug: productId, limit: 6 });
	return data;
}

// No <Suspense>: the read is cached, and a boundary would move the grid out of <main> into a hidden block (AGENTS.md).
export async function RelatedProducts({ productId }: { productId: string }) {
	const related = await getRelatedProducts(productId);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			title="You might also like"
			description="More products to explore"
			products={related}
			showViewAll={false}
			eagerFirstImage={false}
		/>
	);
}
