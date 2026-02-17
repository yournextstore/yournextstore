import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import { ArrowRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSImage } from "@/lib/yns-image";
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	products?: (Product | APICollectionGetByIdResult["productCollections"][number]["product"])[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
	columns?: 3 | 4;
};

export async function ProductGrid({
	title = "Featured Products",
	description,
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
	columns = 4,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const gridCols =
		columns === 4 ? "grid-cols-2 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
			<div className="flex items-center justify-between mb-8">
				<div>
					<h2 className="text-sm sm:text-base font-semibold tracking-[0.15em] uppercase text-foreground">
						{title}
					</h2>
					{description && <p className="mt-1 text-xs text-foreground/50">{description}</p>}
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-1 text-xs tracking-widest uppercase text-foreground/50 hover:text-foreground transition-colors"
					>
						View all
						<ArrowRight className="h-3 w-3" />
					</YnsLink>
				)}
			</div>

			<div className={`grid ${gridCols} gap-4 sm:gap-6`}>
				{displayProducts.map((product) => {
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
						<YnsLink prefetch={"eager"} key={product.id} href={`/product/${product.slug}`} className="group">
							<div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-3">
								{primaryImage && (
									<YNSImage
										src={primaryImage}
										alt={product.name}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
										className="object-cover transition-opacity duration-500 group-hover:opacity-0"
									/>
								)}
								{secondaryImage && (
									<YNSImage
										src={secondaryImage}
										alt={`${product.name} - alternate view`}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
										className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
									/>
								)}
								<div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
									<div className="bg-foreground text-primary-foreground text-center py-2 text-[10px] tracking-[0.2em] uppercase">
										Quick View
									</div>
								</div>
							</div>
							<div className="space-y-1">
								<h3 className="text-xs font-medium text-foreground truncate">{product.name}</h3>
								<p className="text-xs text-foreground/70">{priceDisplay}</p>
							</div>
						</YnsLink>
					);
				})}
			</div>

			{showViewAll && (
				<div className="mt-8 text-center sm:hidden">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-xs tracking-widest uppercase text-foreground/50 hover:text-foreground transition-colors"
					>
						View all products
						<ArrowRight className="h-3 w-3" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
