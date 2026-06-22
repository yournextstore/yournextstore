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
	eyebrow?: string;
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
	title = "Popular Products",
	eyebrow = "This Season",
	description = "Loved by our community — slow-made, beautifully imperfect.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-background py-20 sm:py-28">
			<div className="max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
					<div>
						<span className="inline-flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-[var(--olive)] mb-4">
							<span className="h-px w-8 bg-[var(--olive)]" />
							{eyebrow}
						</span>
						<h2 className="font-display text-5xl sm:text-6xl tracking-tight text-[var(--olive-deep)]">
							{title.split(" ").map((word, i, arr) =>
								i === arr.length - 1 ? (
									<em key={i} className="italic font-light text-[var(--olive)]">
										{word}
									</em>
								) : (
									<span key={i}>{word} </span>
								),
							)}
						</h2>
						<p className="mt-4 text-[var(--stone)] max-w-md">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--olive-deep)] hover:text-[var(--olive)] transition-colors"
						>
							<span className="border-b border-[var(--olive-deep)]/30 pb-0.5">View all products</span>
							<ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}
