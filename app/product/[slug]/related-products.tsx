import { cacheLife } from "next/cache";
import Link from "next/link";
import { pill } from "@/components/munch/styles";
import type { CardProduct } from "@/components/product-card";
import { QuickAddButton } from "@/components/quick-add-button";
import { FeaturedRow } from "@/components/sections/home";
import { commerce } from "@/lib/commerce";
import { formatMoney } from "@/lib/money";
import { displayPrice } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";

// Cached per category, not per product: every product page in a category shares one
// browse, and the current product is filtered out afterwards.
export async function getCategoryProducts(categorySlug?: string) {
	"use cache";
	cacheLife("minutes");
	const { data } = await commerce
		.productBrowse({
			active: true,
			limit: 9,
			...(categorySlug ? { category: categorySlug } : {}),
		})
		.catch(() => ({ data: [] }));
	return data;
}

/** "You may also like": the same card row as the home page, with the outlined Shop all pill. */
export function RelatedProducts({ products }: { products: CardProduct[] }) {
	if (products.length === 0) return null;
	return (
		<FeaturedRow
			title="You may also like"
			products={products}
			cta={{ href: "/products", label: "Shop all" }}
		/>
	);
}

type AddonProduct = Awaited<ReturnType<typeof getCategoryProducts>>[number];

/** "Pair it with": a blush box of two neighbours with their own Add + pill. */
export async function Addons({ products }: { products: AddonProduct[] }) {
	if (products.length === 0) return null;
	const { currency, locale, taxBehavior } = await getStoreConfig();
	return (
		<div className="flex flex-col gap-xs rounded-lg bg-blush p-s">
			<h2 className="font-serif text-d-base leading-[1.2] tracking-[-0.64px] lg:text-d-lg">
				Pairs well with
			</h2>
			{products.map((product) => {
				const variant = product.variants[0];
				const image = product.images.find((url) => !isVideoUrl(url));
				const single = product.variants.length === 1 && variant && variant.stock !== 0;
				return (
					<div key={product.id} className="flex w-full gap-xs">
						<Link
							href={`/product/${product.slug}`}
							className="relative size-25 shrink-0 overflow-hidden rounded-lg border-[1.5px] border-brand"
						>
							{image && (
								<YNSMedia src={image} alt={product.name} fill sizes="100px" className="object-cover" />
							)}
						</Link>
						<div className="flex w-full min-w-0 flex-col justify-between gap-xs">
							<div className="flex flex-col gap-1">
								<Link
									href={`/product/${product.slug}`}
									className="text-b-md leading-[1.5] font-semibold lg:text-b-lg"
								>
									{product.name}
								</Link>
								{variant && (
									<span className="text-b-sm leading-[1.5] lg:text-b-md">
										{formatMoney({
											amount: BigInt(displayPrice(variant, taxBehavior)),
											currency,
											locale,
										})}
									</span>
								)}
							</div>
							{single ? (
								<QuickAddButton
									variantId={variant.id}
									variantSku={variant.sku}
									variantPrice={variant.price}
									variantPriceGross={variant.priceGross}
									variantImages={variant.images}
									product={{ id: product.id, name: product.name, slug: product.slug, images: product.images }}
									className={pill({ size: "sm", variant: "outline-ink", className: "self-end" })}
								>
									Add<span className="sr-only"> {product.name} to cart</span> +
								</QuickAddButton>
							) : (
								<Link
									href={`/product/${product.slug}`}
									className={pill({ size: "sm", variant: "outline-ink", className: "self-end" })}
								>
									Choose<span className="sr-only"> options for {product.name}</span>
								</Link>
							)}
						</div>
					</div>
				);
			})}
		</div>
	);
}
