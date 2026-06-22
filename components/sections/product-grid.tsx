import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	/** Load the first card's image eagerly. Off for grids below the fold (related products). */
	eagerFirstImage?: boolean;
};

export async function ProductGrid({
	title = "Shop the flavor packs",
	description = "Small-batch crunch, big-batch joy.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-yns-cream-soft border-y-2 border-[color:var(--border)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
				<div className="text-center mb-12">
					<p className="font-script text-yns-red text-2xl sm:text-3xl tracking-wide">
						Everyone&apos;s favorite
					</p>
					<h2 className="font-display text-yns-brown text-4xl sm:text-5xl lg:text-6xl mt-1">{title}</h2>
					<p className="mt-3 text-yns-brown/70 italic">{description}</p>
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
					{displayProducts.map((product, idx) => (
						<ProductCard
							key={product.id}
							product={product}
							tintIndex={idx}
							priority={eagerFirstImage && idx === 0}
						/>
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center">
						<Link href={viewAllHref} className="btn-pill-solid">
							View all flavors
							<ArrowRight className="h-4 w-4" />
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
