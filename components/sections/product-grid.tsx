import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
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
	className?: string;
};

const isPictured = (product: Product) =>
	product.images.length > 0 || product.variants.some((variant) => (variant.images?.length ?? 0) > 0);

/** The newest products, photographed ones first, so the grid never opens on an empty frame. */
async function getFeaturedProducts(limit: number) {
	const { data } = await commerce.productBrowse({ active: true, limit: Math.max(limit * 3, 24) });
	return [...data.filter(isPictured), ...data.filter((product) => !isPictured(product))].slice(0, limit);
}

/** A titled three-up product grid (two-up on phones) on the 12-column layout. */
export async function ProductGrid({
	title = "Featured products",
	description,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	className,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await getFeaturedProducts(limit));

	return (
		<section id="products" className={className}>
			<div className="layout">
				<div className="col-span-full mb-8 flex items-end justify-between gap-6 md:mb-16">
					<div>
						<h2 className="text-title-md md:text-title-2xl">{title}</h2>
						{description && <p className="mt-2 text-grayscale-500 md:text-body-lg">{description}</p>}
					</div>
					{showViewAll && (
						<Link
							href={viewAllHref}
							className="inline-flex h-8 shrink-0 items-center rounded-xs bg-foreground px-4 text-body-xs text-background transition-colors hover:bg-grayscale-800 md:h-12 md:px-6 md:text-body"
						>
							View All
						</Link>
					)}
				</div>
			</div>
			<div className="layout gap-y-10 md:gap-y-16">
				{displayProducts.map((product) => (
					<div key={product.id} className="col-span-6 md:col-span-4">
						<ProductCard product={product} />
					</div>
				))}
			</div>
		</section>
	);
}
