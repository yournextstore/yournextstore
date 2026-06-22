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
	variant?: "grid" | "shelf";
};

export async function ProductGrid({
	title = "Featured Titles",
	description = "The current shelf, hand-picked this week.",
	eyebrow = "— On the shelf",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	variant = "shelf",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	if (variant === "shelf") {
		return (
			<section id="products" className="relative bg-cream-dark border-y-2 border-ink overflow-hidden">
				{/* shelf line */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
					<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
						<div>
							{eyebrow && (
								<span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-cobalt mb-3">
									{eyebrow}
								</span>
							)}
							<h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground">
								{title}
							</h2>
							<p className="mt-2 text-muted-foreground max-w-md">{description}</p>
						</div>
						{showViewAll && (
							<YnsLink
								prefetch="eager"
								href={viewAllHref}
								className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase text-foreground hover:text-cobalt transition-colors"
							>
								Entire shelf
								<ArrowRight className="h-4 w-4" />
							</YnsLink>
						)}
					</div>
				</div>

				<div className="relative">
					<div className="overflow-x-auto pb-12 sm:pb-16 scrollbar-thin">
						<div className="flex gap-6 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto min-w-max">
							{displayProducts.map((product, i) => (
								<div
									key={product.id}
									className="w-[260px] sm:w-[300px] flex-none"
									style={{
										transform: `rotate(${(i % 2 === 0 ? -1 : 1) * (0.6 + (i % 3) * 0.25)}deg)`,
									}}
								>
									<ProductCard product={product} />
								</div>
							))}
						</div>
					</div>
					{/* shelf board */}
					<div className="absolute left-0 right-0 bottom-0 h-3 bg-ink" />
					<div className="absolute left-0 right-0 bottom-3 h-1.5 bg-cobalt/30" />
				</div>

				{showViewAll && (
					<div className="sm:hidden text-center pb-8">
						<YnsLink
							prefetch="eager"
							href={viewAllHref}
							className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase text-foreground"
						>
							Entire shelf
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</div>
				)}
			</section>
		);
	}

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					{eyebrow && (
						<span className="block text-[11px] tracking-[0.22em] uppercase font-semibold text-cobalt mb-3">
							{eyebrow}
						</span>
					)}
					<h2 className="font-display text-3xl sm:text-4xl font-black text-foreground">{title}</h2>
					<p className="mt-2 text-muted-foreground">{description}</p>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch="eager"
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase text-foreground hover:text-cobalt transition-colors"
					>
						View all
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{displayProducts.map((product, index) => (
					<ProductCard key={product.id} product={product} priority={index === 0} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center sm:hidden">
					<YnsLink
						prefetch="eager"
						href={viewAllHref}
						className="inline-flex items-center gap-2 text-sm font-semibold tracking-[0.18em] uppercase text-foreground"
					>
						View all products
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
