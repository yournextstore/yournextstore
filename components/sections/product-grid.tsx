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
	offset?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	tone?: "light" | "muted";
};

export async function ProductGrid({
	title = "You might need",
	description,
	products,
	limit = 10,
	offset = 0,
	showViewAll = true,
	viewAllHref = "/products",
	tone = "light",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit, offset })).data;

	if (displayProducts.length === 0) {
		return null;
	}

	const wrapper = tone === "muted" ? "bg-[var(--secondary)]/40" : "";

	return (
		<section id="products" className={wrapper}>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
				<div className="mb-6 flex items-end justify-between gap-4">
					<div>
						<h2 className="font-display text-2xl font-bold text-[var(--brand-deep)] sm:text-3xl">{title}</h2>
						{description && <p className="mt-1 text-sm text-[var(--muted-foreground)]">{description}</p>}
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent-rose)] transition-colors hover:text-[var(--brand-deep)]"
						>
							See more
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
					{displayProducts.slice(0, limit).map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}
