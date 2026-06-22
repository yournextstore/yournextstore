import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
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
	variant?: "favorites" | "grid";
};

export async function ProductGrid({
	title = "Favorites",
	description = "We have made a selection of our customers' favorite products",
	products,
	limit = 3,
	showViewAll = true,
	viewAllHref = "/products",
	variant = "favorites",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	if (variant === "favorites") {
		return (
			<section id="products" className="bg-background">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						{/* Intro card */}
						<div className="md:col-span-1 flex flex-col justify-between rounded-2xl bg-[var(--sand)]/60 border border-border p-7">
							<div>
								<span className="text-[10px] tracking-[0.28em] uppercase text-[var(--mahogany)] font-medium">
									{title}
								</span>
								<p className="mt-4 font-display text-2xl leading-snug text-foreground">{description}</p>
							</div>
							{showViewAll && (
								<YnsLink
									prefetch={"eager"}
									href={viewAllHref}
									className="mt-10 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase font-medium text-foreground border-b border-foreground/40 pb-1 w-fit hover:border-foreground transition-colors"
								>
									See All
									<ArrowRight className="h-3.5 w-3.5" />
								</YnsLink>
							)}
						</div>
						{/* Product cards */}
						{displayProducts.slice(0, 3).map((product, i) => (
							<div key={product.id} className="relative">
								{i === 0 && (
									<span className="absolute z-10 top-3 left-3 inline-flex items-center rounded-md bg-[var(--mahogany)] text-[var(--bone)] text-[10px] tracking-[0.16em] uppercase font-medium px-2.5 py-1">
										New
									</span>
								)}
								{i === 2 && (
									<span className="absolute z-10 top-3 left-3 inline-flex items-center rounded-md bg-[var(--mahogany)] text-[var(--bone)] text-[10px] tracking-[0.16em] uppercase font-medium px-2.5 py-1">
										Popular
									</span>
								)}
								<ProductCard product={product} />
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<span className="text-[10px] tracking-[0.28em] uppercase text-[var(--mahogany)] font-medium">
						{title}
					</span>
					<h2 className="mt-2 font-display text-3xl sm:text-4xl text-foreground">{description}</h2>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-1 text-[11px] tracking-[0.22em] uppercase font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						View all
						<ArrowRight className="h-3.5 w-3.5" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center sm:hidden">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-[11px] tracking-[0.22em] uppercase font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						View all products
						<ArrowRight className="h-3.5 w-3.5" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
