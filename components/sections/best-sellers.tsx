import type { APIProductsBrowseResult } from "commerce-kit";
import { cacheLife } from "next/cache";
import Image from "next/image";
import { MaterialIcon } from "@/components/icons/material-icon";
import { ProductBadge } from "@/components/product/product-badge";
import { StarRating } from "@/components/product/star-rating";
import { YnsLink } from "@/components/yns-link";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";

export type Product = APIProductsBrowseResult["data"][number];

type BestSellersProps = {
	limit?: number;
};

export async function BestSellers({ limit = 4 }: BestSellersProps) {
	"use cache";
	cacheLife("minutes");

	const products = (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section className="py-20 bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<div className="text-center mb-12">
					<span className="text-primary font-semibold text-sm tracking-wider uppercase">Our Collection</span>
					<h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-foreground">Best Sellers</h2>
					<p className="text-muted-foreground max-w-2xl mx-auto">
						Discover our most popular CBD oils and products, loved by thousands for their purity and
						effectiveness.
					</p>
				</div>

				{/* Product Grid */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					{products.map((product, index) => {
						const variants = product.variants;
						const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
						const priceDisplay = firstVariantPrice
							? formatMoney({ amount: firstVariantPrice, currency: CURRENCY, locale: LOCALE })
							: null;

						const allImages = [
							...(product.images ?? []),
							...(variants
								?.flatMap((v) => v.images ?? [])
								.filter((img) => !(product.images ?? []).includes(img)) ?? []),
						];
						const primaryImage = allImages[0];

						// Assign badges based on position for demo
						const badgeType = index === 0 ? "hot" : index === 3 ? "sale" : null;
						// Random rating between 4 and 5 for demo
						const rating = 4 + (index % 2) * 0.5;

						return (
							<div
								key={product.id}
								className="group relative bg-card rounded-xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-border"
							>
								<YnsLink prefetch={"eager"} href={`/product/${product.slug}`}>
									<div className="relative product-card-bg rounded-lg aspect-square flex items-center justify-center mb-4 overflow-hidden">
										{primaryImage ? (
											<Image
												src={primaryImage}
												alt={product.name}
												fill
												sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
												className="object-cover group-hover:scale-110 transition-transform duration-500"
											/>
										) : (
											<MaterialIcon name="spa" className="text-primary text-6xl" />
										)}
										{badgeType && (
											<div className="absolute top-3 left-3">
												<ProductBadge variant={badgeType} />
											</div>
										)}
										<button
											type="button"
											className="absolute bottom-4 left-1/2 -translate-x-1/2 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 bg-primary text-white text-sm font-medium py-2 px-6 rounded-full shadow-lg transition-all duration-300 whitespace-nowrap"
										>
											Quick Add
										</button>
									</div>
									<div className="text-center">
										<div className="flex justify-center mb-1">
											<StarRating rating={rating} />
										</div>
										<h3 className="text-lg font-semibold text-card-foreground mb-1">{product.name}</h3>
										<p className="text-primary font-bold">{priceDisplay}</p>
									</div>
								</YnsLink>
							</div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
