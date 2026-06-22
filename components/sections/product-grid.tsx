import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowLeft, ArrowRight, Camera } from "lucide-react";
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
	variant?: "default" | "newest";
};

export async function ProductGrid({
	title = "Featured Pieces",
	description = "Handpicked favorites from our latest collection",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	variant = "default",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	if (variant === "newest") {
		return (
			<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-16 sm:pb-20">
				<div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10">
					<div className="flex items-end gap-5">
						<h2 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-[--ink]">
							{title}
						</h2>
						<div className="hidden sm:flex items-center gap-2 mb-2">
							<button
								type="button"
								className="grid place-items-center h-9 w-9 rounded-full border border-[--ink]/10 text-[--ink]/70 hover:bg-[--sun]/15 hover:text-[--ink] transition-colors"
								aria-label="Previous"
							>
								<ArrowLeft className="h-4 w-4" />
							</button>
							<button
								type="button"
								className="grid place-items-center h-9 w-9 rounded-full bg-[--ink] text-white hover:bg-[--ember] transition-colors"
								aria-label="Next"
							>
								<ArrowRight className="h-4 w-4" />
							</button>
						</div>
					</div>
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-2 text-sm font-medium text-[--ink]/80 hover:text-[--ember] transition-colors"
					>
						<Camera className="h-4 w-4" />
						Quick Update on Instagram
						<span className="h-px w-10 bg-[--ink]/30" />
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</section>
		);
	}

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-10">
				<div>
					<p className="text-xs font-medium uppercase tracking-[0.18em] text-[--ember]">Collection</p>
					<h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[--ink]">{title}</h2>
					<p className="mt-2 text-[--ink]/65">{description}</p>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-[--ink]/70 hover:text-[--ember] transition-colors"
					>
						View all
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center sm:hidden">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-sm font-medium text-[--ink]/70 hover:text-[--ember] transition-colors"
					>
						View all products
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
