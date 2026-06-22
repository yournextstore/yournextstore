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
	title = "Featured Products",
	description = "Tier-1 panels, inverters and bundles — picked for performance and efficiency.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	eyebrow = "Shop the line",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
				<div>
					<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--forest)]/70 divider-leaf">
						{eyebrow}
					</p>
					<h2 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">{title}</h2>
					<p className="mt-2 text-[15px] text-muted-foreground max-w-xl">{description}</p>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-2 self-start sm:self-end h-10 px-5 rounded-full bg-[var(--lime)] text-[var(--forest-deep)] text-sm font-semibold hover:brightness-95 transition"
					>
						View all products
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
