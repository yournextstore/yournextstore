import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import { ArrowRight, Eye, ShoppingCart } from "lucide-react";
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
};

export async function ProductGrid({
	title = "Featured Products",
	description = "Premium natural wellness products",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			{/* Section header with view toggle style matching reference */}
			<div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
				<h2 className="text-lg sm:text-xl font-semibold text-foreground">{title}</h2>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
					>
						View all
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				)}
			</div>

			{/* 4-column grid matching reference */}
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
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

					return (
						<YnsLink prefetch={"eager"} key={product.id} href={`/product/${product.slug}`} className="group">
							<div className="bg-white rounded-lg border border-border overflow-hidden transition-shadow hover:shadow-lg">
								{/* Image */}
								<div className="relative aspect-square bg-white overflow-hidden">
									{primaryImage && (
										<YNSImage
											src={primaryImage}
											alt={product.name}
											fill
											sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
											className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
										/>
									)}
								</div>

								{/* Product info */}
								<div className="p-3 sm:p-4 border-t border-border">
									<h3 className="text-sm font-medium text-foreground line-clamp-2 min-h-[2.5rem] leading-tight">
										{product.name}
									</h3>
									<p className="mt-2 text-base font-bold text-primary">{priceDisplay}</p>

									{/* Action icons matching reference */}
									<div className="mt-3 flex items-center gap-2">
										<span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors">
											<ShoppingCart className="h-4 w-4" />
										</span>
										<span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-muted-foreground hover:bg-primary hover:text-white transition-colors">
											<Eye className="h-4 w-4" />
										</span>
									</div>
								</div>
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
						className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
					>
						View all products
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
