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
};

export async function ProductGrid({
	title = "Collection",
	description = "Selected works",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[#FAFAF8]">
			{/* Top border line */}
			<div className="h-px w-full bg-zinc-200" />

			<div className="max-w-7xl mx-auto px-8 lg:px-16 py-24 lg:py-32">
				{/* Section header - museum label style */}
				<div className="flex items-end justify-between mb-20">
					<div>
						<p className="text-xs tracking-[0.3em] uppercase text-zinc-400 mb-4">{description}</p>
						<h2 className="text-4xl lg:text-5xl font-light tracking-[-0.02em] text-zinc-900">{title}</h2>
					</div>
					{showViewAll && (
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="hidden sm:inline-flex items-center gap-3 text-xs tracking-[0.15em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
						>
							View all
							<ArrowRight className="h-3 w-3" />
						</YnsLink>
					)}
				</div>

				{/* Product grid - asymmetric museum layout */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
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
							<YnsLink
								prefetch={"eager"}
								key={product.id}
								href={`/product/${product.slug}`}
								className="group"
							>
								{/* Product image - clean rectangle */}
								<div className="relative aspect-[3/4] bg-zinc-100 overflow-hidden mb-6">
									{primaryImage && (
										<YNSImage
											src={primaryImage}
											alt={product.name}
											fill
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											className="object-cover transition-all duration-700 group-hover:scale-105"
										/>
									)}
									{secondaryImage && (
										<YNSImage
											src={secondaryImage}
											alt={`${product.name} - alternate view`}
											fill
											sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
											className="object-cover opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
										/>
									)}
								</div>

								{/* Product info - minimal typography */}
								<div className="space-y-2">
									<p className="text-xs tracking-[0.2em] uppercase text-zinc-400">
										{String(index + 1).padStart(2, "0")}
									</p>
									<h3 className="text-base font-light text-zinc-900 group-hover:text-zinc-500 transition-colors">
										{product.name}
									</h3>
									<p className="text-sm text-zinc-500 font-light">{priceDisplay}</p>
								</div>
							</YnsLink>
						);
					})}
				</div>

				{showViewAll && (
					<div className="mt-16 text-center sm:hidden">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center gap-3 text-xs tracking-[0.15em] uppercase text-zinc-400 hover:text-zinc-900 transition-colors"
						>
							View all products
							<ArrowRight className="h-3 w-3" />
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
