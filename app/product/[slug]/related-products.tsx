import { cacheLife } from "next/cache";
import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";

// The merchant's suggested products first, then the same category. The platform picks the
// order and leaves out the product itself and anything a shopper can't buy right now.
async function getRelatedProducts(productId: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce.productRelated({ idOrSlug: productId, limit: 6 });
	return data;
}

export function RelatedProducts(props: { productId: string }) {
	return (
		<Suspense>
			<RelatedProductsContent {...props} />
		</Suspense>
	);
}

async function RelatedProductsContent({ productId }: { productId: string }) {
	const related = await getRelatedProducts(productId);

	if (related.length === 0) return null;

	return (
		<ProductGrid
			title="You might also like"
			description="More products to explore"
			products={related}
			showViewAll={false}
		/>
	);
}
