import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
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
	viewAllHref?: string;
	/** "row" is the product page's four-up "You may also like"; "grid" the three-up shelf. */
	layout?: "grid" | "row";
	className?: string;
};

export async function ProductGrid({
	title,
	products,
	limit = 6,
	viewAllHref,
	layout = "grid",
	className,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section className={cn(layout === "row" ? "px-6 py-14 lg:px-14" : "shell py-14", className)}>
			{title && (
				<div className="mb-6 flex items-end justify-between gap-4 lg:mb-8">
					<h2 className="text-[1.5rem] font-semibold leading-tight text-ink lg:text-[1.75rem]">{title}</h2>
					{viewAllHref && (
						<Link href={viewAllHref} className="link-bar shrink-0 text-ink">
							View all
						</Link>
					)}
				</div>
			)}
			<div
				className={cn(
					"grid grid-cols-2 gap-x-4 gap-y-10",
					layout === "row" ? "md:grid-cols-3 lg:grid-cols-4 lg:gap-x-4" : "lg:grid-cols-3 lg:gap-x-8",
				)}
			>
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
		</section>
	);
}
