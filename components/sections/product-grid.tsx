import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSMedia } from "@/lib/yns-media";

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
	columns?: 3 | 4;
	/** Load the first card's image eagerly. Off for grids below the fold (related products). */
	eagerFirstImage?: boolean;
};

export async function ProductGrid({
	title = "Featured Products",
	description = "Handpicked favorites from our collection",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	columns = 3,
	eagerFirstImage = true,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const gridCols =
		columns === 4 ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

	return (
		<section id="products" className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 sm:py-20">
			<div className="flex items-end justify-between mb-10">
				<div>
					<h2 className="font-heading text-2xl sm:text-3xl text-foreground tracking-wide">{title}</h2>
					{description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
				</div>
				{showViewAll && (
					<Link
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
					>
						View all
						<ArrowRight className="h-3.5 w-3.5" />
					</Link>
				)}
			</div>

			<div className={`grid ${gridCols} gap-5`}>
				{displayProducts.map((product, index) => {
					const variants = "variants" in product ? product.variants : null;
					const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
					const { minPrice, maxPrice } =
						variants && firstVariantPrice !== null
							? variants.reduce(
									(acc, v) => {
										const price = BigInt(v.price);
										return {
											minPrice: price < acc.minPrice ? price : acc.minPrice,
											maxPrice: price > acc.maxPrice ? price : acc.maxPrice,
										};
									},
									{ minPrice: firstVariantPrice, maxPrice: firstVariantPrice },
								)
							: { minPrice: null, maxPrice: null };

					const priceDisplay =
						variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
							? `${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })} - ${formatMoney({ amount: maxPrice, currency: CURRENCY, locale: LOCALE })}`
							: minPrice
								? formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })
								: null;

					const allImages = [
						...(product.images ?? []),
						...(variants
							?.flatMap((v) => v.images ?? [])
							.filter((img) => !(product.images ?? []).includes(img)) ?? []),
					];
					const primaryImage = allImages[0];
					const secondaryImage = allImages[1];

					return (
						<Link key={product.id} href={`/product/${product.slug}`} className="group">
							<div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-3">
								{primaryImage && (
									<YNSMedia
										src={primaryImage}
										priority={eagerFirstImage && index === 0}
										alt={product.name}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="object-cover transition-opacity duration-500 group-hover:opacity-0"
									/>
								)}
								{secondaryImage && (
									<YNSMedia
										src={secondaryImage}
										alt={`${product.name} - alternate view`}
										fill
										sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
									/>
								)}
								{/* Quick view overlay */}
								<div className="absolute inset-x-0 bottom-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<span className="bg-white/90 backdrop-blur-sm text-foreground text-xs uppercase tracking-[0.15em] px-6 py-2.5">
										Quick view
									</span>
								</div>
							</div>
							<div className="text-center space-y-1">
								<h3 className="text-sm text-foreground">{product.name}</h3>
								<p className="text-sm text-muted-foreground">{priceDisplay}</p>
							</div>
						</Link>
					);
				})}
			</div>

			{showViewAll && (
				<div className="mt-10 text-center sm:hidden">
					<Link
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.15em] text-muted-foreground hover:text-foreground transition-colors"
					>
						View all products
						<ArrowRight className="h-3.5 w-3.5" />
					</Link>
				</div>
			)}
		</section>
	);
}
