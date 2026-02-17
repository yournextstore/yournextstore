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
	columns?: 3 | 4 | 5;
};

export async function ProductGrid({
	title = "Featured Products",
	description,
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
	columns = 3,
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	const gridCols =
		columns === 5
			? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"
			: columns === 4
				? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
				: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

	return (
		<section id="products" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
			<div className="mb-10 flex items-end justify-between">
				<div>
					<h2 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
						{title}
					</h2>
					{description && <p className="mt-2 text-muted-foreground">{description}</p>}
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
					>
						View all
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				)}
			</div>

			<div className={`grid gap-6 ${gridCols}`}>
				{displayProducts.map((product) => {
					const variants = "variants" in product ? product.variants : null;
					const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
					const { minPrice } =
						variants && firstVariantPrice !== null
							? variants.reduce(
									(acc, v) => {
										const price = BigInt(v.price);
										return {
											minPrice: price < acc.minPrice ? price : acc.minPrice,
										};
									},
									{ minPrice: firstVariantPrice },
								)
							: { minPrice: null };

					const priceDisplay = minPrice
						? `From ${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })}`
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
							<div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-secondary">
								{primaryImage && (
									<YNSImage
										src={primaryImage}
										alt={product.name}
										fill
										sizes={
											columns === 5
												? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
												: columns === 4
													? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
													: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										}
										className="object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-0"
									/>
								)}
								{secondaryImage && (
									<YNSImage
										src={secondaryImage}
										alt={`${product.name} - alternate view`}
										fill
										sizes={
											columns === 5
												? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
												: columns === 4
													? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
													: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
										}
										className="object-cover opacity-0 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
									/>
								)}
							</div>
							<div className="mt-3 space-y-1">
								<h3 className="text-sm font-medium text-foreground">{product.name}</h3>
								{priceDisplay && <p className="text-sm text-muted-foreground">{priceDisplay}</p>}
							</div>
						</YnsLink>
					);
				})}
			</div>

			{showViewAll && (
				<div className="mt-10 text-center sm:hidden">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
					>
						View all products
						<ArrowRight className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
