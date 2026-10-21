import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import { type CardProduct, ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

export type Product = APIProductsBrowseResult["data"][number];

/** The original's "Some other things you might like" row: a serif line over a four-up grid. */
export async function ProductGrid({
	title,
	products,
	limit = 8,
}: {
	title?: string;
	products?: CardProduct[];
	limit?: number;
}) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section className="py-3 md:py-4 lg:py-8">
			{title && (
				<h2 className="w-2/3 font-serif text-xl leading-tight md:w-full md:text-3xl md:leading-normal">
					{title}
				</h2>
			)}
			<div className="grid grid-cols-2 gap-4 pt-4 md:gap-8 md:pt-8 xl:grid-cols-4">
				{displayProducts.map((product) => (
					<ProductCard
						key={product.id}
						product={product}
						imageClassName="h-72 md:h-96 lg:h-112"
						sizes="(max-width: 1280px) 50vw, 25vw"
					/>
				))}
			</div>
		</section>
	);
}
