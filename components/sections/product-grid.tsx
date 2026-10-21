import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import { Carousel } from "@/components/carousel";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
};

export const productSlideClass = "w-[calc(100%-2.5rem)] xs:w-1/2 sm:w-1/3 lg:w-1/4";

/** The original's "Trending listings" row: uppercase title over a carousel of bordered cards. */
// The home rail: photographed products first, so a product without images never leads the page.
async function getPicturedFirst(limit: number) {
	const { data } = await commerce.productBrowse({ active: true, limit: Math.max(limit * 3, 24) });
	const hasImage = (p: Product) => p.images.length > 0 || p.variants.some((v) => v.images.length > 0);
	return [...data.filter(hasImage), ...data.filter((p) => !hasImage(p))].slice(0, limit);
}

export async function ProductGrid({ title = "Trending now", products, limit = 4 }: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await getPicturedFirst(limit));
	if (displayProducts.length === 0) return null;

	return (
		<section className="page-x w-full py-8">
			<h2 className="mb-6 text-heading font-medium uppercase md:text-title">{title}</h2>
			<Carousel label={title} itemClassName={productSlideClass} desktopControls={displayProducts.length > 4}>
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} className="h-full" />
				))}
			</Carousel>
		</section>
	);
}

export function ProductRowSkeleton() {
	return (
		<section className="page-x w-full py-8">
			<div className="mb-6 h-8 w-56 animate-pulse rounded-xs bg-secondary md:h-10" />
			<div className="flex overflow-hidden">
				{Array.from({ length: 4 }).map((_, index) => (
					<div key={index} className={`shrink-0 rounded-sm border border-border p-1 ${productSlideClass}`}>
						<div className="aspect-square animate-pulse rounded-xs bg-secondary" />
						<div className="space-y-2 p-4">
							<div className="h-6 w-3/4 animate-pulse rounded-xs bg-secondary" />
							<div className="h-6 w-1/4 animate-pulse rounded-xs bg-secondary" />
						</div>
					</div>
				))}
			</div>
			<div className="mt-4 h-8 sm:hidden" />
		</section>
	);
}
