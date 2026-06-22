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
};

export async function ProductGrid({
	title = "The Lineup",
	description = "Three signature sauces, each cold-blended for honest flavor.",
	products,
	limit = 3,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-[var(--brand-cream)] pb-24 pt-4 sm:pb-28">
			<div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
				<div className="mb-14 flex items-end justify-between gap-6">
					<div>
						<p className="font-mono-ed text-[10px] uppercase tracking-[0.28em] text-[var(--brand-ember)]">
							Vol. 01 — Shelf
						</p>
						<h2 className="mt-4 font-display text-[clamp(1.75rem,3.5vw,3rem)] font-medium leading-tight tracking-[-0.01em] text-[var(--brand-ink)]">
							{title}
						</h2>
						<p className="mt-3 max-w-md font-mono-ed text-[12px] leading-relaxed text-[var(--brand-ink)]/65">
							{description}
						</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="group hidden items-center gap-2 border-b border-[var(--brand-ink)] pb-1 font-mono-ed text-[11px] uppercase tracking-[0.2em] text-[var(--brand-ink)] sm:inline-flex"
						>
							Shop All
							<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
					{displayProducts.map((product, idx) => (
						<div key={product.id} className="group/item">
							<p className="mb-3 font-mono-ed text-[10px] uppercase tracking-[0.22em] text-[var(--brand-ink)]/45">
								No. {String(idx + 1).padStart(2, "0")}
							</p>
							<ProductCard product={product} />
						</div>
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 border-b border-[var(--brand-ink)] pb-1 font-mono-ed text-[11px] uppercase tracking-[0.2em] text-[var(--brand-ink)]"
						>
							Shop All
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
