import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
import { ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YnsLink } from "../yns-link";
import { YNSImage } from "@/lib/yns-image";

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
	title,
	description,
	products,
	limit = 6,
	showViewAll = false,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("seconds");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section className="grid grid-cols-12 h-auto">
			{displayProducts.map((product, index) => {
				const variants = "variants" in product ? product.variants : null;
				const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
				const { minPrice } =
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
						: { minPrice: null };

				const priceDisplay = minPrice
					? formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })
					: null;

				const allImages = [
					...(product.images ?? []),
					...(variants
						?.flatMap((v) => v.images ?? [])
						.filter((img) => !(product.images ?? []).includes(img)) ?? []),
				];
				const primaryImage = allImages[0];

				// Determine column span based on position (creates asymmetric layout)
				const position = index % 3;
				const isLastInRow = position === 2;
				const borderClass = isLastInRow ? "" : "grid-border-r";

				return (
					<div
						key={product.id}
						className={`col-span-12 md:col-span-4 ${borderClass} relative group min-h-[300px] md:min-h-[400px]`}
					>
						{/* Product info overlay - top right */}
						<div className="absolute top-4 right-4 text-right z-10">
							<p className="font-bold text-sm">{product.name}</p>
							<div className="flex items-center justify-end space-x-1">
								<span className="font-mono text-sm">{priceDisplay}</span>
								<ArrowUpRight className="w-3 h-3 transform rotate-0" />
							</div>
						</div>

						{/* Product image with rotation effect */}
						<YnsLink href={`/product/${product.slug}`} className="block h-full">
							<div className="h-[300px] md:h-[400px] flex items-center justify-center p-6 relative overflow-hidden">
								{primaryImage && (
									<YNSImage
										src={primaryImage}
										alt={product.name}
										fill
										sizes="(max-width: 768px) 100vw, 33vw"
										className="object-contain w-full h-full transform -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-500 drop-shadow-xl filter dark:contrast-125"
									/>
								)}
								{/* Brand label that appears on hover */}
								<span className="absolute top-1/2 left-4 text-[10px] bg-foreground text-background px-1 font-mono transform -rotate-90 origin-left opacity-0 group-hover:opacity-100 transition-opacity">
									PREMIUM
								</span>
							</div>
						</YnsLink>

						{/* Add to cart button - bottom right */}
						<div className="absolute bottom-6 right-6 z-10">
							<YnsLink
								href={`/product/${product.slug}`}
								className="text-xs font-bold uppercase border-b-2 border-foreground hover:text-primary hover:border-primary transition-colors pb-0.5"
							>
								Add to cart
							</YnsLink>
						</div>
					</div>
				);
			})}

			{/* Optional description section */}
			{(title || description) && (
				<div className="col-span-12 md:col-span-4 grid-border-r p-8 grid-border-b flex items-center">
					{title && <h3 className="font-bold text-lg mb-2">{title}</h3>}
					{description && (
						<p className="text-xs md:text-sm leading-relaxed text-justify opacity-80">{description}</p>
					)}
				</div>
			)}

			{/* Store CTA section */}
			{showViewAll && (
				<div className="col-span-12 md:col-span-4 grid-border-r grid-border-b h-[200px] flex items-center justify-between px-8 md:px-12 relative overflow-hidden group">
					<YnsLink
						href={viewAllHref}
						className="relative z-10 w-24 h-24 rounded-full border border-primary text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300"
					>
						<span className="text-xs font-bold tracking-widest uppercase ml-1">Store</span>
						<ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
					</YnsLink>
					<div className="text-right z-10">
						<span className="text-xs font-bold text-primary uppercase block mb-1">New Collection</span>
						<div className="w-16 h-0.5 bg-primary ml-auto" />
					</div>
				</div>
			)}
		</section>
	);
}

export function ProductGridSkeleton() {
	return (
		<section className="grid grid-cols-12 h-auto">
			{[0, 1, 2].map((i) => (
				<div
					key={i}
					className={`col-span-12 md:col-span-4 ${i < 2 ? "grid-border-r" : ""} relative min-h-[300px] md:min-h-[400px] animate-pulse`}
				>
					<div className="absolute top-4 right-4 text-right">
						<div className="h-4 w-24 bg-muted mb-2" />
						<div className="h-4 w-16 bg-muted ml-auto" />
					</div>
					<div className="h-[300px] md:h-[400px] flex items-center justify-center p-6">
						<div className="w-48 h-48 bg-muted rounded" />
					</div>
					<div className="absolute bottom-6 right-6">
						<div className="h-4 w-20 bg-muted" />
					</div>
				</div>
			))}
		</section>
	);
}
