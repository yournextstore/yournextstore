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
	viewAllLabel?: string;
};

export async function ProductGrid({
	title = "Today's best deals for you",
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	viewAllLabel = "See all products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	if (displayProducts.length === 0) {
		return null;
	}

	return (
		<section id="products" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
			<div className="mb-8 flex items-end justify-between gap-4">
				<div className="max-w-xl">
					<h2 className="font-display text-2xl font-bold leading-tight text-foreground sm:text-3xl lg:text-4xl">
						{title}
					</h2>
					{description && <p className="mt-2 text-sm text-muted-foreground sm:text-base">{description}</p>}
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--mint-deep)] underline-offset-4 hover:underline sm:inline-flex"
					>
						{viewAllLabel}
						<ArrowRight className="h-3.5 w-3.5" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
				{displayProducts.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
			</div>

			{showViewAll && (
				<div className="mt-10 text-center sm:hidden">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--mint-deep)]"
					>
						{viewAllLabel}
						<ArrowRight className="h-3.5 w-3.5" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
