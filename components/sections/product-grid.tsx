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
	title = "The catalogue",
	description = "A curated selection of sculptural objects and wooden toys.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "New arrivals",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-14 border-b border-[color:var(--border)] pb-8">
				<div className="max-w-xl">
					<p className="yns-eyebrow text-[color:var(--yns-terracotta)]">{eyebrow}</p>
					<h2 className="mt-3 font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-foreground leading-none">
						{title}
					</h2>
					{description && <p className="mt-4 text-[15px] text-muted-foreground max-w-md">{description}</p>}
				</div>
				{showViewAll && (
					<YnsLink
						prefetch="eager"
						href={viewAllHref}
						className="self-start sm:self-end inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-foreground hover:text-background transition-all"
					>
						View all
						<span>→</span>
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} index={index} priority={index === 0} />
				))}
			</div>
		</section>
	);
}
