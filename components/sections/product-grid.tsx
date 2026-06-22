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
	/** Load the first card's image eagerly. Off for grids below the fold (related products). */
	eagerFirstImage?: boolean;
};

export async function ProductGrid({
	title = "Featured drop",
	description = "Hand-picked from drop 003 — limited quantities.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative skylrk-drop-bg py-20 sm:py-28 overflow-hidden">
			{/* transition vignette */}
			<div
				aria-hidden="true"
				className="absolute top-0 inset-x-0 h-32 pointer-events-none"
				style={{
					background: "linear-gradient(180deg, rgba(6,26,38,0.9) 0%, transparent 100%)",
				}}
			/>
			<div className="relative max-w-[1400px] mx-auto px-6">
				<div className="flex items-end justify-between mb-14">
					<div>
						<p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan-300/70 mb-3">
							[ 001 — curated ]
						</p>
						<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
							{title}
						</h2>
						<p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<Link
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.24em] text-foreground/70 hover:text-cyan-200 transition-colors"
						>
							[ View all → ]
						</Link>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
					{displayProducts.map((product, i) => (
						<ProductCard key={product.id} product={product} priority={eagerFirstImage && i === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<Link
							href={viewAllHref}
							className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.24em] text-foreground/70 hover:text-cyan-200 transition-colors"
						>
							[ View all products → ]
						</Link>
					</div>
				)}
			</div>
		</section>
	);
}
