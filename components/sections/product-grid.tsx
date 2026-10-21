import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { PRODUCT_GRID } from "@/components/product-grid-skeleton";
import { commerce } from "@/lib/commerce";
import { pickVisuallyDistinct } from "@/lib/display";
import { cn } from "@/lib/utils";

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
	/** "centered" is the original's "We Think You'll Love" heading; "left" its "Featured Products". */
	heading?: "left" | "centered";
	className?: string;
};

export async function ProductGrid({
	title = "Featured Products",
	description,
	products,
	limit = 4,
	showViewAll = false,
	viewAllHref = "/products",
	heading = "left",
	className,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts =
		products ??
		pickVisuallyDistinct(
			// A set or bundle priced at zero would show no price on a "featured" card.
			(await commerce.productBrowse({ active: true, limit: limit * 3 })).data.filter((product) =>
				product.variants.some((variant) => Number(variant.price) > 0),
			),
			limit,
		);
	if (displayProducts.length === 0) return null;

	return (
		<section className={cn("mt-12", className)}>
			{heading === "centered" ? (
				<h2 className="pt-20 pb-8 text-center text-2xl font-semibold">{title}</h2>
			) : (
				<div className="flex items-end justify-between gap-6">
					<div>
						<h2 className="mb-1 text-2xl font-semibold md:mb-3 md:text-3xl">{title}</h2>
						{description && (
							<p className="mb-2 max-w-4xl text-sm leading-normal tracking-[-0.02em] md:text-base">
								{description}
							</p>
						)}
					</div>
					{showViewAll && (
						<Link href={viewAllHref} className="mb-2 shrink-0 text-sm underline-offset-4 hover:underline">
							View all
						</Link>
					)}
				</div>
			)}
			<div className={cn(PRODUCT_GRID, "py-5")}>
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0 && heading === "left"} />
				))}
			</div>
		</section>
	);
}
