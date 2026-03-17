import { Suspense } from "react";
import { ProductGrid } from "@/components/sections/product-grid";
import { commerce } from "@/lib/commerce";

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
	const result = await commerce.productBrowse({
		active: true,
		limit: 7,
		...(categorySlug ? { category: categorySlug } : {}),
	});

	const related = result.data.filter((p) => p.id !== productId).slice(0, 6);

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
