import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
};

export async function ProductGrid({
	title = "The Collection",
	description = "Handcrafted pieces, made to last.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;
	const count = displayProducts.length;
	const pages = Math.max(1, Math.ceil(count / 4));

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-10 gap-6 flex-wrap">
				<div className="max-w-xl">
					<div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
						<span className="h-1.5 w-1.5 rounded-full bg-tan" />
						Featured Pieces
					</div>
					<h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
						{title}
					</h2>
					<p className="mt-3 text-muted-foreground text-base sm:text-lg">{description}</p>
				</div>
				<div className="flex items-center gap-4">
					<span className="text-sm tabular-nums text-muted-foreground">
						<span className="text-foreground font-medium">1</span>
						<span className="mx-1">/</span>
						<span>{pages}</span>
					</span>
					<div className="flex items-center gap-2">
						<button
							type="button"
							aria-label="Previous"
							className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-accent transition-colors"
						>
							<ArrowLeft className="h-4 w-4" />
						</button>
						<button
							type="button"
							aria-label="Next"
							className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background hover:bg-accent transition-colors"
						>
							<ArrowRight className="h-4 w-4" />
						</button>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{displayProducts.map((product) => (
					<div
						key={product.id}
						className="rounded-3xl bg-secondary p-3 sm:p-4 hover:bg-accent transition-colors"
					>
						<ProductCard product={product} />
					</div>
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
					>
						View full collection
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
