import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRightIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { Heading } from "@/components/heading";
import { CARD_GRID, ProductCard } from "@/components/product-card";
import { photographedFirst } from "@/lib/catalog";
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
};

export async function ProductGrid({
	title = "Products",
	description = "Below is a list of products we have available for you.",
	products,
	limit = 12,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts =
		products ??
		photographedFirst(
			(await commerce.productBrowse({ active: true, limit: Math.max(limit, 24) })).data,
		).slice(0, limit);

	return (
		<section id="products">
			<div className="flex items-end justify-between gap-4">
				<Heading title={title} description={description} />
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="my-4 inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						View all
						<ArrowRightIcon className="h-4 w-4" aria-hidden />
					</Link>
				)}
			</div>
			<div className={`${CARD_GRID} mb-4`}>
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>
		</section>
	);
}
