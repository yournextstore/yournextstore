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
	title = "Featured goods",
	description = "Bench-made this season, in limited number.",
	eyebrow = "Catalogue",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[var(--cream)]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
					<div>
						<span className="heritage-smallcaps text-[var(--oxblood)]">{eyebrow}</span>
						<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl tracking-[-0.01em] text-[var(--ink)]">
							{title.includes(" ") ? (
								<>
									{title.split(" ").slice(0, -1).join(" ")}{" "}
									<em className="italic">{title.split(" ").slice(-1)}</em>
								</>
							) : (
								title
							)}
						</h2>
						<p className="mt-3 max-w-md text-[15px] italic leading-relaxed text-[var(--ink)]/65">
							{description}
						</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="heritage-smallcaps text-[var(--ink)] hover:text-[var(--oxblood)] transition-colors self-start sm:self-end"
						>
							View the catalogue →
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10 lg:gap-12">
					{displayProducts.map((product, idx) => (
						<ProductCard key={product.id} product={product} index={idx} />
					))}
				</div>
			</div>
		</section>
	);
}
