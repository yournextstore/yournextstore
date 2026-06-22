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
	eyebrow?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	variant?: "debut" | "default";
};

export async function ProductGrid({
	title = "Shop the Collection",
	description = "Performance beauty, engineered for motion.",
	eyebrow = "Featured",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	variant = "default",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	if (variant === "debut") {
		const debut = displayProducts.slice(0, 3);
		return (
			<section id="debut" className="relative bg-cream">
				<div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
					<div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
						<div className="max-w-xl">
							<span className="inline-flex items-center rounded-none bg-ink px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.3em] text-cream">
								Debut Product
							</span>
							<h2 className="mt-6 font-display text-4xl font-light tracking-tight text-ink sm:text-5xl lg:text-6xl">
								Meet Lock &amp; Go.
							</h2>
							<p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
								A setting spray engineered to outlast your workout, your commute, your night out. Sweat-proof.
								Transfer-resistant. Twelve-hour wear.
							</p>
						</div>
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="eyebrow border-b border-ink pb-1 text-ink transition-opacity hover:opacity-70"
						>
							Shop all →
						</YnsLink>
					</div>

					<div className="grid grid-cols-1 gap-1 sm:grid-cols-3">
						{debut.map((product) => (
							<div key={product.id} className="bg-[oklch(0.96_0.012_75)] p-6 sm:p-8">
								<ProductCard product={product} />
							</div>
						))}
					</div>
				</div>
			</section>
		);
	}

	return (
		<section id="products" className="relative bg-cream">
			<div className="mx-auto max-w-[1400px] px-4 py-20 sm:px-6 sm:py-28 lg:px-10">
				<div className="mb-12 flex flex-col items-start justify-between gap-4 border-b border-border/60 pb-8 sm:flex-row sm:items-end">
					<div>
						<p className="eyebrow text-bronze">{eyebrow}</p>
						<h2 className="mt-3 font-display text-3xl font-light tracking-tight text-ink sm:text-5xl">
							{title}
						</h2>
						<p className="mt-3 max-w-md text-sm text-muted-foreground sm:text-base">{description}</p>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="eyebrow border-b border-ink/60 pb-1 text-ink/80 transition-colors hover:border-ink hover:text-ink"
						>
							View all →
						</YnsLink>
					)}
				</div>

				<div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
					{displayProducts.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</section>
	);
}
