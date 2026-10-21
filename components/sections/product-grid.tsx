import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { CARD_GRID } from "@/components/product-grid-skeleton";
import { commerce } from "@/lib/commerce";
import { cn } from "@/lib/utils";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	kicker?: string;
	title?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	variant?: "home" | "listing";
	className?: string;
};

export async function ProductGrid({
	kicker = "Handpicked for you",
	title = "New Arrivals",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	variant = "home",
	className,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	// Pictured products first, so a home rail never opens on an empty placeholder.
	const displayProducts =
		products ??
		(
			await commerce.productBrowse({
				active: true,
				limit: Math.max(limit * 3, 24),
				orderBy: "createdAt",
				orderDirection: "desc",
			})
		).data
			.map((product, index) => ({
				product,
				index,
				pictured:
					product.images.length > 0 || product.variants.some((v) => (v.images?.length ?? 0) > 0) ? 0 : 1,
			}))
			.sort((a, b) => a.pictured - b.pictured || a.index - b.index)
			.slice(0, limit)
			.map(({ product }) => product);

	return (
		<section id="products" className={cn("shop-container py-16 md:py-24", className)}>
			<div className="mb-10 flex items-end justify-between gap-4">
				<div>
					<p className="kicker mb-2">{kicker}</p>
					<h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight text-foreground">
						{title}
					</h2>
				</div>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="shrink-0 border-b border-transparent pb-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-brand hover:text-brand"
					>
						View all <span aria-hidden>→</span>
					</Link>
				)}
			</div>

			{displayProducts.length > 0 ? (
				<div className={CARD_GRID}>
					{displayProducts.map((product, index) => (
						<ProductCard key={product.id} product={product} priority={index === 0} variant={variant} />
					))}
				</div>
			) : (
				<p className="py-20 text-center font-display text-2xl italic text-muted-foreground">
					Products coming soon
				</p>
			)}
		</section>
	);
}
