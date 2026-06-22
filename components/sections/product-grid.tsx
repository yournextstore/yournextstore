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
	title = "Bestsellers",
	description = "Loved on repeat — the pieces our customers can't stop reordering.",
	eyebrow = "The Edit",
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
			<div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
				<div className="mb-12 flex flex-col items-center justify-center gap-2 text-center">
					<p className="text-[11px] font-medium uppercase tracking-[0.24em] text-clay">{eyebrow}</p>
					<h2
						className="font-display text-[40px] italic leading-tight tracking-tight text-foreground sm:text-[52px]"
						style={{ fontFamily: "var(--font-cormorant)" }}
					>
						{title}
					</h2>
					{description && (
						<p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{description}</p>
					)}
				</div>

				<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex h-12 items-center justify-center rounded-full border border-foreground/15 px-10 text-[12px] font-semibold uppercase tracking-[0.22em] text-foreground transition-all hover:border-foreground/50 hover:bg-foreground hover:text-cream"
						>
							View all
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
