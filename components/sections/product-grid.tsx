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
	variant?: "favorites" | "default";
};

const BADGE_STYLES = [
	{ label: "NEW!", className: "bg-[color:var(--clay)] text-[color:var(--ink)]" },
	{ label: "POPULAR", className: "bg-[color:var(--blush)] text-[color:var(--oxblood)]" },
	{ label: "LIMITED", className: "bg-[color:var(--oxblood)] text-cream" },
	{ label: "STAFF PICK", className: "bg-[color:var(--ink)] text-cream" },
];

export async function ProductGrid({
	title = "Favorites",
	description = "We have made a selection of our customers' favorite products.",
	products,
	limit = 3,
	showViewAll = true,
	viewAllHref = "/products",
	variant = "favorites",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	if (variant === "favorites") {
		return (
			<section
				id="favorites"
				className="relative sand-paper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 sm:pt-20 sm:pb-28"
			>
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-x-10 gap-y-8 items-start">
					<div className="lg:col-span-3 lg:pr-6 lg:pt-10">
						<p className="eyebrow text-[color:var(--oxblood)]">{title}</p>
						<p className="mt-6 text-sm text-muted-foreground leading-relaxed">{description}</p>
						{showViewAll && (
							<YnsLink
								prefetch={"eager"}
								href={viewAllHref}
								className="mt-14 inline-flex items-center gap-3 text-[12px] tracking-[0.22em] uppercase text-foreground hover:text-[color:var(--oxblood)] transition-colors"
							>
								See All
								<span aria-hidden className="h-px w-10 bg-current" />
							</YnsLink>
						)}
					</div>
					<div className="lg:col-span-9">
						<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-12">
							{displayProducts.slice(0, 3).map((product, i) => (
								<li key={product.id}>
									<ProductCard product={product} badge={BADGE_STYLES[i % BADGE_STYLES.length]} />
								</li>
							))}
						</ul>
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="products" className="sand-paper max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<p className="eyebrow text-[color:var(--oxblood)]">{title}</p>
					<h2 className="mt-3 font-serif text-3xl sm:text-4xl text-foreground">{description}</h2>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-3 text-[12px] tracking-[0.22em] uppercase text-foreground hover:text-[color:var(--oxblood)] transition-colors"
					>
						See All
						<span aria-hidden className="h-px w-10 bg-current" />
					</YnsLink>
				)}
			</div>
			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-14">
				{displayProducts.map((product, i) => (
					<li key={product.id}>
						<ProductCard product={product} badge={BADGE_STYLES[i % BADGE_STYLES.length]} />
					</li>
				))}
			</ul>
		</section>
	);
}
