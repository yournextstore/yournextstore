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
	background?: "default" | "cream";
};

export async function ProductGrid({
	title = "Featured Plushies",
	description = "Brand new cuddly friends, fresh off the workshop bench.",
	eyebrow = "New arrivals",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	background = "default",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className={background === "cream" ? "bg-cream-panel" : "bg-background"}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="flex flex-col items-center text-center mb-12">
					<span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-[var(--color-mint-deep)]">
						{eyebrow}
					</span>
					<h2
						className="mt-3 font-heading text-3xl sm:text-4xl lg:text-5xl text-foreground"
						style={{ fontVariationSettings: "'SOFT' 100" }}
					>
						{title}
					</h2>
					<p className="mt-3 max-w-xl text-muted-foreground">{description}</p>
					<div className="mt-6 flex items-center gap-3 text-[var(--color-peach)]" aria-hidden="true">
						<span className="h-px w-10 bg-current" />
						<svg width="18" height="18" viewBox="0 0 24 24" className="text-[var(--color-peach)]">
							<title>flourish</title>
							<path
								d="M12 2l2.4 6.6L21 9.8l-5 4.7 1.3 6.7L12 17.8l-5.3 3.4L8 14.5 3 9.8l6.6-1.2L12 2z"
								fill="currentColor"
							/>
						</svg>
						<span className="h-px w-10 bg-current" />
					</div>
				</div>

				<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-foreground/80 px-7 h-12 text-sm font-semibold tracking-wide text-foreground hover:bg-foreground hover:text-background transition-colors"
						>
							Shop the whole family
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
