import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowUpRight } from "lucide-react";
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
	editorial?: boolean;
};

export async function ProductGrid({
	title = "New Collection",
	description = "Our latest collection. Where pared-back contemporary tailoring meets the quiet poetry of perfect moments.",
	eyebrow = "Spring / Summer 2026",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	editorial = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	if (!editorial) {
		return (
			<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
				<div className="flex items-end justify-between mb-10">
					<div>
						<p className="text-[11px] tracking-[0.32em] uppercase text-bronze">{eyebrow}</p>
						<h2 className="font-display text-3xl sm:text-4xl font-medium text-foreground mt-2">{title}</h2>
						<p className="mt-2 text-muted-foreground max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							View all
							<ArrowUpRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</section>
		);
	}

	return (
		<section id="collection" className="bg-background">
			<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-20 sm:pt-28 pb-16 sm:pb-24">
				{/* Centered editorial header */}
				<div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
					<p className="text-[11px] tracking-[0.36em] uppercase text-bronze mb-5 flex items-center justify-center gap-3">
						<span className="h-px w-8 bg-clay" aria-hidden="true" />
						{eyebrow}
						<span className="h-px w-8 bg-clay" aria-hidden="true" />
					</p>
					<h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-foreground">
						{title}
					</h2>
					<p className="mt-5 text-[15px] leading-relaxed text-muted-foreground text-balance">{description}</p>
				</div>

				{/* Asymmetric 4-column grid */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 sm:gap-x-7 gap-y-14">
					{displayProducts.slice(0, 8).map((product, idx) => (
						<div
							key={product.id}
							className={
								idx === 1 || idx === 5
									? "sm:translate-y-8 lg:translate-y-12"
									: idx === 3 || idx === 7
										? "lg:translate-y-6"
										: ""
							}
						>
							<ProductCard product={product} />
						</div>
					))}
				</div>

				{showViewAll && (
					<div className="mt-20 flex justify-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="group inline-flex items-center gap-3 text-sm tracking-[0.22em] uppercase font-medium text-foreground border-b border-foreground/30 pb-1 hover:border-foreground transition-colors"
						>
							View entire collection
							<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
