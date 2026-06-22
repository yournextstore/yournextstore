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
	compact?: boolean;
};

export async function ProductGrid({
	title,
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	compact = false,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background relative">
			{/* subtle dot grid */}
			<div
				aria-hidden="true"
				className="absolute inset-0 opacity-[0.05] pointer-events-none"
				style={{
					backgroundImage: "radial-gradient(#3b2418 1px, transparent 1px)",
					backgroundSize: "24px 24px",
				}}
			/>
			<div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
				{(title || description) && (
					<div className="flex items-end justify-between mb-8 sm:mb-10 gap-6 flex-wrap">
						<div>
							{title && (
								<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-yns-cocoa italic">
									{title}
								</h2>
							)}
							{description && <p className="mt-2 text-base text-yns-cocoa/70 max-w-md">{description}</p>}
						</div>
						{showViewAll && (
							<YnsLink
								prefetch={"eager"}
								href={viewAllHref}
								className="hidden sm:inline-flex items-center gap-1.5 text-sm font-extrabold uppercase tracking-wider text-yns-green hover:text-yns-green-dark transition-colors yns-nav-underline"
							>
								View all
								<ArrowRight className="h-4 w-4" strokeWidth={3} />
							</YnsLink>
						)}
					</div>
				)}

				<div
					className={`grid gap-5 sm:gap-6 ${compact ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4" : "grid-cols-2 lg:grid-cols-4"}`}
				>
					{displayProducts.map((product, i) => (
						<ProductCard key={product.id} product={product} priority={i === 0} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-10 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1 text-sm font-extrabold uppercase tracking-wider text-yns-green"
						>
							View all products
							<ArrowRight className="h-4 w-4" strokeWidth={3} />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
