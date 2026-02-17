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
};

export async function ProductGrid({
	title = "Popular picks",
	description,
	products,
	limit = 4,
	showViewAll = false,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="text-center mb-12">
				<h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-foreground">
					{title}
				</h2>
				{description && <p className="mt-2 text-muted-foreground">{description}</p>}
			</div>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
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
							? `from ${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })}`
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
							<div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-4">
								{primaryImage && (
									<YNSImage
										src={primaryImage}
										alt={product.name}
										fill
										sizes="(max-width: 640px) 50vw, 25vw"
										className="object-cover transition-opacity duration-500 group-hover:opacity-0"
									/>
								)}
								{secondaryImage && (
									<YNSImage
										src={secondaryImage}
										alt={`${product.name} - alternate view`}
										fill
										sizes="(max-width: 640px) 50vw, 25vw"
										className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
									/>
								)}
							</div>
							<div className="text-center space-y-1">
								<h3 className="text-sm text-foreground">{product.name}</h3>
								<p className="text-sm text-muted-foreground">{priceDisplay}</p>
							</div>
						</YnsLink>
					);
				})}
			</div>

			{showViewAll && (
				<div className="mt-12 text-center">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center px-8 py-3 border border-foreground text-foreground text-xs tracking-widest uppercase hover:bg-foreground hover:text-primary-foreground transition-colors"
					>
						View all
					</YnsLink>
				</div>
			)}
		</section>
	);
}
