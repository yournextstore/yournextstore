import type { APIProductGetByIdResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

/** The editor stores only product ids, so the storefront resolves them itself. */
export async function BlogProductEmbed({ productIds }: { productIds: string[] }) {
	"use cache";
	cacheLife("minutes");

	const products = (await Promise.all(productIds.map((id) => commerce.productGet({ idOrSlug: id })))).filter(
		(product): product is NonNullable<APIProductGetByIdResult> =>
			product !== null && product.status === "published",
	);

	if (products.length === 0) {
		return null;
	}

	return (
		<div className="not-prose my-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
			{products.map((product) => (
				<ProductCard key={product.id} product={product} />
			))}
		</div>
	);
}
