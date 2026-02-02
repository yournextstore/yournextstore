import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import { ArrowRight, Star } from "lucide-react";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSImage } from "@/lib/yns-image";
import { YnsLink } from "../yns-link";
import { ProductWishlistButton } from "./product-wishlist-button";

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
	description = "Handpicked favorites from our collection",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8">
			{/* Section Header */}
			<div className="flex items-end justify-between mb-8">
				<div>
					<h2 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h2>
					<p className="mt-2 text-muted-foreground text-sm">{description}</p>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
					>
						View all
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				)}
			</div>

			{/* Product Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
							<div className="bg-card rounded-3xl p-4 shadow-soft hover:shadow-lg transition-all duration-300">
								{/* Image Container */}
								<div className="relative aspect-square bg-secondary rounded-2xl overflow-hidden mb-4">
									{primaryImage && (
										<YNSImage
											src={primaryImage}
											alt={product.name}
											fill
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											className="object-cover transition-all duration-500 group-hover:opacity-0 group-hover:scale-105"
										/>
									)}
									{secondaryImage && (
										<YNSImage
											src={secondaryImage}
											alt={`${product.name} - alternate view`}
											fill
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											className="object-cover opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
										/>
									)}

									{/* Wishlist Button */}
									<ProductWishlistButton />

									{/* Quick View Badge */}
									<div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
										<span className="bg-card/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
											Quick View
										</span>
									</div>
								</div>

								{/* Product Info */}
								<div className="space-y-2">
									<div className="flex items-start justify-between gap-2">
										<h3 className="text-base font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
											{product.name}
										</h3>
									</div>

									<div className="flex items-center justify-between">
										<p className="text-lg font-bold text-foreground">{priceDisplay}</p>
										<div className="flex items-center gap-1 text-xs text-muted-foreground">
											<Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
											<span>4.8</span>
										</div>
									</div>
								</div>
							</div>
						</YnsLink>
					);
				})}
			</div>

			{/* Mobile View All */}
			{showViewAll && (
				<div className="mt-8 text-center sm:hidden">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-2 bg-card px-6 py-3 rounded-full text-sm font-medium text-foreground shadow-soft hover:shadow-lg transition-all"
					>
						View all products
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
