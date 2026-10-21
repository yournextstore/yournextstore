import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard, productGridClass } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { cn } from "@/lib/utils";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	gridClassName?: string;
};

// The home grid: photographed products first, so a product without images never leads the page.
async function getPicturedFirst(limit: number) {
	const { data } = await commerce.productBrowse({ active: true, limit: Math.max(limit * 3, 24) });
	const hasImage = (p: Product) => p.images.length > 0 || p.variants.some((v) => v.images.length > 0);
	return [...data.filter(hasImage), ...data.filter((p) => !hasImage(p))].slice(0, limit);
}

export async function ProductGrid({
	title = "Trending now",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	gridClassName,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await getPicturedFirst(limit));

	if (displayProducts.length === 0) return null;

	return (
		<section id="products" className="page-container mt-5 md:mt-9 lg:mt-16">
			<div className="mb-3 flex items-baseline justify-between gap-4">
				<h2 className="text-heading font-semibold lg:text-heading-lg">{title}</h2>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="shrink-0 text-body font-medium underline underline-offset-4 hover:text-primary"
					>
						Shop all
					</Link>
				)}
			</div>
			<div className={cn(productGridClass, gridClassName)}>
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
		</section>
	);
}
