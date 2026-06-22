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
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	heading?: boolean;
};

export async function ProductGrid({
	title = "Featured Products",
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	heading = false,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	if (displayProducts.length === 0) {
		return null;
	}

	return (
		<section id="products" className="bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-16 sm:pb-24">
				{heading && (
					<div className="flex items-end justify-between mb-8 pt-12">
						<div>
							<p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground">The Collection</p>
							<h2 className="mt-2 font-display text-3xl sm:text-4xl text-foreground">{title}</h2>
							{description && <p className="mt-2 text-sm text-muted-foreground max-w-md">{description}</p>}
						</div>
						{showViewAll && (
							<YnsLink
								prefetch={"eager"}
								href={viewAllHref}
								className="hidden sm:inline-flex items-center gap-2 text-[11px] tracking-[0.2em] uppercase font-medium text-foreground/80 hover:text-foreground transition-colors border-b border-foreground/30 hover:border-foreground pb-1"
							>
								Shop all →
							</YnsLink>
						)}
					</div>
				)}

				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 flex flex-col items-center gap-4">
						<div className="editorial-rule w-32" />
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center justify-center h-11 px-10 rounded-full border border-foreground text-[11px] tracking-[0.25em] uppercase font-medium hover:bg-foreground hover:text-background transition-colors"
						>
							Load more
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
