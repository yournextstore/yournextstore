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
	tone?: "butter" | "plain";
};

export async function ProductGrid({
	title = "Variety Packs",
	description = "Mix‑and‑match flavor bundles, made with real honey.",
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
	tone = "butter",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className={tone === "butter" ? "bg-background" : "bg-background"}>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
					<div>
						<span className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-3 py-1 text-[10px] font-bold tracking-[0.25em]">
							SHOP THE LINEUP
						</span>
						<h2 className="mt-3 font-display font-extrabold text-foreground text-3xl sm:text-5xl tracking-tight uppercase">
							{title}
						</h2>
						<p className="mt-2 text-muted-foreground max-w-xl">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="self-start sm:self-end inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-white px-5 h-10 text-sm font-display font-extrabold tracking-wide uppercase hover:bg-[--color-sun-pop] transition-colors"
						>
							Shop all
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{displayProducts.map((product, idx) => (
						<ProductCard key={product.id} product={product} boxCount={(idx % 3) + 5} priority={idx === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-12 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							View all products
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
