import type { APICollectionGetByIdResult, APIProductsBrowseResult } from "commerce-kit";
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
	columns?: 3 | 4 | 5;
};

export async function ProductGrid({
	title = "Bestsellers",
	description,
	products,
	limit = 10,
	showViewAll = true,
	viewAllHref = "/products",
	columns = 5,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const gridColsClass =
		columns === 5
			? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
			: columns === 4
				? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
				: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

	return (
		<section id="products" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
			<div className="flex items-end justify-between mb-10">
				<div>
					<h2 className="text-2xl sm:text-3xl font-medium text-foreground">{title}</h2>
					{description && <p className="mt-2 text-muted-foreground text-sm">{description}</p>}
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center text-xs tracking-[0.15em] uppercase font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-muted-foreground/30 pb-0.5"
					>
						Shop Now
					</YnsLink>
				)}
			</div>

			<div className={`grid ${gridColsClass} gap-4 sm:gap-6`}>
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
							<div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-3">
								{primaryImage && (
									<YNSImage
										src={primaryImage}
										alt={product.name}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
										className="object-cover transition-opacity duration-500 group-hover:opacity-0"
									/>
								)}
								{secondaryImage && (
									<YNSImage
										src={secondaryImage}
										alt={`${product.name} - alternate view`}
										fill
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
										className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
									/>
								)}
							</div>
							<div className="space-y-0.5">
								<h3 className="text-xs sm:text-sm font-medium text-foreground truncate">{product.name}</h3>
								<p className="text-xs sm:text-sm text-muted-foreground">{priceDisplay}</p>
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
						className="inline-flex items-center text-xs tracking-[0.15em] uppercase font-medium text-muted-foreground hover:text-foreground transition-colors border-b border-muted-foreground/30 pb-0.5"
					>
						View all products
					</YnsLink>
				</div>
			)}
		</section>
	);
}
