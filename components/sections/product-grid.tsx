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
	eyebrow?: string;
};

export async function ProductGrid({
	title = "the drop",
	description = "three small rituals for falling, staying, and dreaming",
	products,
	limit = 3,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "issue 01 — winter",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[var(--yns-paper)]">
			<div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-end mb-12 sm:mb-16">
					<div>
						<div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[var(--yns-red)] mb-4">
							<span className="inline-block w-8 h-px bg-[var(--yns-red)]" />
							{eyebrow}
						</div>
						<h2 className="font-[family-name:var(--font-display)] italic text-5xl sm:text-6xl lg:text-7xl tracking-tight text-[var(--yns-ink)] leading-[0.95]">
							{title}
							<span className="text-[var(--yns-red)] not-italic">.</span>
						</h2>
						<p className="mt-5 text-[var(--yns-ink)]/70 max-w-md text-sm sm:text-base leading-relaxed">
							{description}
						</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[var(--yns-ink)] hover:text-[var(--yns-red)] transition-colors border-b border-[var(--yns-ink)]/30 pb-1"
						>
							browse the apothecary
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 sm:gap-y-16">
					{displayProducts.slice(0, 3).map((product, idx) => (
						<div key={product.id} className="relative">
							<div className="absolute -top-3 -left-3 z-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[var(--yns-red)]">
								<span className="inline-block w-6 h-px bg-[var(--yns-red)]" />
								no. 0{idx + 1}
							</div>
							<ProductCard product={product} />
						</div>
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.25em] text-[var(--yns-ink)] hover:text-[var(--yns-red)] transition-colors"
						>
							browse the apothecary
							<ArrowRight className="h-3.5 w-3.5" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
