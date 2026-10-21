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
import { SECTION_GRID } from "@/lib/grid";

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
	title = "Featured Products",
	description = "Handpicked favorites from our collection",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="shell space-y-6 py-14 md:py-20">
			<div className="flex items-center justify-between gap-4">
				<div className="flex flex-1 flex-col gap-0.5">
					<h2 className="font-heading text-2xl leading-[1.1] md:text-3xl">{title}</h2>
					{description ? (
						<p className="text-sm leading-normal text-muted-foreground sm:text-base sm:leading-7">
							{description}
						</p>
					) : null}
				</div>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="hidden h-9 shrink-0 items-center gap-2 rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent sm:inline-flex"
					>
						View all
						<ArrowRight className="size-4" aria-hidden="true" />
					</Link>
				)}
			</div>

			<div className={SECTION_GRID}>
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>

			{showViewAll && (
				<Link
					href={viewAllHref}
					className="mx-auto flex h-9 w-fit items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors hover:bg-accent sm:hidden"
				>
					View all products
					<ArrowRight className="size-4" aria-hidden="true" />
				</Link>
			)}
		</section>
	);
}
