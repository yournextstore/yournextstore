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
	title = "Meet the lineup",
	description = "Four just-right blends — built for the moment, made for sharing.",
	eyebrow = "Shop the flavors",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-[color:var(--cream)] px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
			<div className="max-w-[1400px] mx-auto">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12 sm:mb-16">
					<div className="max-w-2xl">
						<p className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[color:var(--brown-warm)] mb-3">
							{eyebrow}
						</p>
						<h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] leading-[0.94] text-[color:var(--charcoal)]">
							{title}
						</h2>
						<p className="mt-4 text-base sm:text-lg text-[color:var(--muted-foreground)] max-w-xl">
							{description}
						</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] font-semibold text-[color:var(--charcoal)] border-b border-[color:var(--charcoal)] pb-1 hover:text-[color:var(--dusty-blue)] hover:border-[color:var(--dusty-blue)] transition-colors self-end"
						>
							View all
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-8">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] font-semibold text-[color:var(--charcoal)] border-b border-[color:var(--charcoal)] pb-1"
						>
							View all products
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
