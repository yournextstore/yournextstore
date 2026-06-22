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
	variant?: "lineup" | "default";
};

export async function ProductGrid({
	title = "The Lineup",
	description = "Cold-pressed, hot-pulled, bottled bold. Each can punches above its weight.",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	variant = "lineup",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative overflow-hidden bg-[#f2f2f2] py-24 sm:py-32">
			{/* concrete-texture backdrop */}
			<div
				aria-hidden
				className="absolute inset-0 opacity-[0.04]"
				style={{
					backgroundImage:
						"radial-gradient(circle at 25% 25%, #0e0e0e 1px, transparent 1px), radial-gradient(circle at 75% 75%, #0e0e0e 1px, transparent 1px)",
					backgroundSize: "40px 40px, 60px 60px",
				}}
			/>

			<div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
					<div className="max-w-2xl">
						<span className="jolt-eyebrow inline-block text-[#0e0e0e]">— The Lineup</span>
						<h2 className="jolt-headline mt-3 text-4xl sm:text-5xl lg:text-6xl text-[#0e0e0e]">{title}</h2>
						<p className="mt-4 text-base text-[#6e6e6e] leading-relaxed">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="group inline-flex items-center gap-2 border-b border-[#0e0e0e] pb-1 text-xs font-bold uppercase tracking-[0.2em] text-[#0e0e0e] transition-all hover:gap-3"
						>
							View all
							<ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
						</YnsLink>
					)}
				</div>

				<div
					className={
						variant === "lineup"
							? "grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3"
							: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
					}
				>
					{displayProducts.map((product, i) => (
						<ProductCard key={product.id} product={product} priority={i === 0} />
					))}
				</div>
			</div>
		</section>
	);
}
