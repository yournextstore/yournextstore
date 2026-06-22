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
	variant?: "default" | "pink-band";
};

export async function ProductGrid({
	title = "YNS Must-Haves",
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	variant = "pink-band",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	if (variant === "pink-band") {
		return (
			<section id="products" className="yns-pink-band">
				{/* Pink header strip */}
				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pt-14 pb-10">
					<div className="flex items-end justify-between gap-6 flex-wrap">
						<h2 className="font-display text-[color:var(--yns-ink)] text-4xl sm:text-5xl lg:text-6xl tracking-tight uppercase">
							{title}
						</h2>
						{showViewAll && (
							<YnsLink
								prefetch={"eager"}
								href={viewAllHref}
								className="inline-flex items-center gap-2 text-[12px] font-extrabold tracking-[0.18em] uppercase text-[color:var(--yns-ink)] hover:text-white transition-colors"
							>
								Shop All
								<ArrowRight className="h-4 w-4" />
							</YnsLink>
						)}
					</div>
				</div>

				<div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 pb-20">
					<div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
						{displayProducts.map((product) => (
							<div
								key={product.id}
								className="bg-white p-4 sm:p-6 group hover:shadow-[0_24px_60px_-20px_rgba(0,0,0,0.18)] transition-shadow"
							>
								<ProductCard product={product} />
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="products" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<h2 className="font-display text-3xl sm:text-4xl text-foreground uppercase tracking-tight">
						{title}
					</h2>
					{description && <p className="mt-2 text-muted-foreground">{description}</p>}
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-1 text-[12px] font-extrabold tracking-[0.18em] uppercase text-[color:var(--yns-red)] hover:text-[color:var(--yns-ink)] transition-colors"
					>
						Shop All
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>
		</section>
	);
}
