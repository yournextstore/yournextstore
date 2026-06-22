import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	eyebrow?: string;
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
	title = "Just Arrived",
	description = "Considered pieces from this season's collection.",
	eyebrow = "New In",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10">
				<div className="mb-10 flex items-end justify-between">
					<div>
						<p className="eyebrow text-mushroom">{eyebrow}</p>
						<h2 className="mt-3 font-display text-3xl text-foreground sm:text-4xl lg:text-[40px] lg:tracking-[-0.02em]">
							{title}
						</h2>
						<p className="mt-2 max-w-md text-sm text-mushroom">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex text-sm font-medium text-foreground underline underline-offset-[6px] decoration-[1px] hover:decoration-2 transition-all"
						>
							Shop All
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="text-sm font-medium text-foreground underline underline-offset-[6px] decoration-[1px]"
						>
							Shop All
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
