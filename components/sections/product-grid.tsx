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
	description = "Handpicked favorites from our collection",
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
		columns === 3 ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="flex items-end justify-between mb-8">
				<div>
					<h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide text-foreground">
						{title}
					</h2>
					{description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-1 text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-primary transition-colors"
					>
						View all
						<ArrowRight className="h-3.5 w-3.5" />
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
							? `From ${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })}`
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
							<div className="relative aspect-[3/4] bg-secondary rounded-lg overflow-hidden mb-3">
								{primaryImage && (
									<YNSImage
										src={primaryImage}
										alt={product.name}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
										className="object-cover transition-opacity duration-500 group-hover:opacity-0"
									/>
								)}
								{secondaryImage && (
									<YNSImage
										src={secondaryImage}
										alt={`${product.name} - alternate view`}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
										className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
									/>
								)}
							</div>
							<div className="space-y-1 px-0.5">
								<h3 className="text-sm font-medium text-foreground leading-snug">{product.name}</h3>
								<p className="text-sm text-muted-foreground">{priceDisplay}</p>
							</div>
						</YnsLink>
					);
				})}
			</div>

			{showViewAll && (
				<div className="mt-10 text-center">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center justify-center h-11 px-8 border border-foreground text-foreground text-xs font-medium tracking-[0.15em] uppercase hover:bg-foreground hover:text-primary-foreground transition-colors"
					>
						Shop All Products
					</YnsLink>
				</div>
			)}
		</section>
	);
}
