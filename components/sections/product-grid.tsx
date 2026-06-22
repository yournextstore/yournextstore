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
	title = "The Lineup",
	description = "Daily protocol, engineered for the male epidermis.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "Volume 01 — Editorial",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section
			id="products"
			className="relative bg-cream/40 border-y border-foreground/10"
			style={{ backgroundColor: "#f0e7d6" }}
		>
			<div className="px-6 sm:px-10 lg:px-14 py-20 lg:py-28">
				<div className="grid lg:grid-cols-12 gap-10 mb-14 items-end">
					<div className="lg:col-span-7">
						<p className="eyebrow text-taupe mb-5">{eyebrow}</p>
						<h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl leading-[1.02] tracking-tight text-ink">
							{title}
						</h2>
					</div>
					<div className="lg:col-span-5 flex flex-col sm:items-end gap-4">
						<p className="font-mono text-[0.8rem] leading-relaxed text-taupe max-w-sm sm:text-right">
							{description}
						</p>
						{showViewAll && (
							<YnsLink
								prefetch={"eager"}
								href={viewAllHref}
								className="inline-flex items-center gap-3 font-mono text-[0.65rem] tracking-[0.3em] uppercase text-ink hover:text-umber transition-colors"
							>
								<span className="inline-block w-8 h-px bg-ink/60" />
								Full catalogue
							</YnsLink>
						)}
					</div>
				</div>

				<div className="hairline-divider mb-10" />

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-px gap-y-12 sm:gap-x-px sm:gap-y-16">
					{displayProducts.map((product, idx) => (
						<div key={product.id} className="relative">
							<span className="absolute -top-6 left-0 font-mono text-[0.55rem] tracking-[0.3em] uppercase text-taupe/70 z-10">
								{String(idx + 1).padStart(2, "0")} / {String(displayProducts.length).padStart(2, "0")}
							</span>
							<ProductCard product={product} />
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
