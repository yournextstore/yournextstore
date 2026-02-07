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

// Luxury jewelry placeholder images
const jewelryImages = [
	"https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80",
	"https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80",
	"https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80",
	"https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80",
	"https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80",
	"https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80",
];

export async function ProductGrid({
	title = "Featured Collection",
	description = "Handcrafted pieces of exceptional beauty",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
			{/* Section Header */}
			<div className="text-center mb-16">
				<p className="text-xs tracking-[0.3em] uppercase text-primary mb-4">Our Pieces</p>
				<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-light text-foreground">{title}</h2>
				<p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{description}</p>
				<div className="mt-6 w-24 h-px bg-primary/50 mx-auto" />
			</div>

			{showViewAll && (
				<div className="flex justify-end mb-8">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300"
					>
						View All Pieces
						<ArrowRight className="h-3 w-3" />
					</YnsLink>
				</div>
			)}

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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

					// Use jewelry images as placeholders
					const jewelryImage = jewelryImages[index % jewelryImages.length];

					return (
						<YnsLink prefetch={"eager"} key={product.id} href={`/product/${product.slug}`} className="group">
							<div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-6">
								<YNSImage
									src={jewelryImage}
									alt={product.name}
									fill
									sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
									className="object-cover transition-all duration-700 group-hover:scale-105"
								/>
								{/* Overlay on hover */}
								<div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
								{/* Quick view button */}
								<div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
									<span className="block w-full py-3 bg-background/95 text-center text-xs tracking-[0.2em] uppercase font-medium">
										View Details
									</span>
								</div>
							</div>
							<div className="text-center space-y-2">
								<h3 className="text-sm tracking-[0.1em] uppercase font-medium text-foreground group-hover:text-primary transition-colors duration-300">
									{product.name}
								</h3>
								<p className="text-base font-light text-primary">{priceDisplay}</p>
							</div>
						</YnsLink>
					);
				})}
			</div>

			{showViewAll && (
				<div className="mt-16 text-center">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-2 h-14 px-12 border border-primary text-primary text-xs tracking-[0.2em] uppercase font-medium hover:bg-primary hover:text-primary-foreground transition-all duration-300"
					>
						Explore Full Collection
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
