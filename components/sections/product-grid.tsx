import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { btnGhostClass, eyebrowClass, sectionTitleClass } from "@/lib/styles";
import { cn } from "@/lib/utils";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	eyebrow?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	viewAllLabel?: string;
	align?: "center" | "start";
	className?: string;
};

/** The original's product row: small-caps eyebrow over a serif title, a 2/4-column card grid, a ghost button. */
export async function ProductGrid({
	title = "Best Sellers",
	eyebrow = "Curated Favourites",
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
	viewAllLabel = "View All Products",
	align = "center",
	className,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section className={cn("mx-auto max-w-7xl px-6 py-12 lg:px-12 lg:py-20", className)}>
			<div className={cn("mb-12", align === "center" && "text-center")}>
				<p className={eyebrowClass}>{eyebrow}</p>
				<h2 className={sectionTitleClass}>{title}</h2>
			</div>

			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center">
					<Link href={viewAllHref} className={btnGhostClass}>
						{viewAllLabel}
					</Link>
				</div>
			)}
		</section>
	);
}
