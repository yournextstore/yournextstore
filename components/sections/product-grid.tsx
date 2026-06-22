import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "../quick-add-button";
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	eyebrow?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
};

function EditorialProductCard({
	product,
}: {
	product: Product | APICollectionGetByIdResult["productCollections"][number]["product"];
}) {
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
			? `${formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })} – ${formatMoney({ amount: maxPrice, currency: CURRENCY, locale: LOCALE })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency: CURRENCY, locale: LOCALE })
				: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];
	const singleVariant = variants?.length === 1 ? variants[0] : null;

	return (
		<YnsLink prefetch={"eager"} href={`/product/${product.slug}`} className="group block">
			<div className="relative aspect-square overflow-hidden bg-[#ebe4d3]">
				{singleVariant && (
					<QuickAddButton
						variantId={singleVariant.id}
						variantPrice={singleVariant.price}
						variantImages={singleVariant.images}
						product={{
							id: product.id,
							name: product.name,
							slug: product.slug,
							images: product.images ?? [],
						}}
					/>
				)}
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-[1.03]"}`}
							src={primaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={primaryImage}
							alt={product.name}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className={`object-cover transition-all duration-700 ${secondaryImage ? "group-hover:opacity-0" : "group-hover:scale-[1.03]"}`}
						/>
					))}
				{secondaryImage &&
					(isVideoUrl(secondaryImage) ? (
						<video
							className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
							src={secondaryImage}
							muted
							loop
							autoPlay
							playsInline
						/>
					) : (
						<YNSMedia
							src={secondaryImage}
							alt={`${product.name} - alternate view`}
							fill
							sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
							className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
						/>
					))}
			</div>
			<div className="mt-6 text-center">
				<h3 className="font-label text-[11px] text-bark-soft">{product.name}</h3>
				<p className="mt-1.5 font-label text-[11px] text-foreground/80">{priceDisplay}</p>
			</div>
		</YnsLink>
	);
}

export async function ProductGrid({
	title = "The Longevity Series",
	description = "Three daily rituals — formulated with full-spectrum functional mushrooms.",
	eyebrow = "SHOP THE LINE",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-[#f5efe3]">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				<div className="text-center max-w-2xl mx-auto mb-14">
					<p className="font-label text-clay mb-4" style={{ color: "#8b7560" }}>
						{eyebrow}
					</p>
					<h2 className="font-editorial text-3xl sm:text-4xl lg:text-[44px] font-medium text-foreground leading-[1.1]">
						{title}
					</h2>
					<p className="mt-4 text-foreground/65 text-base leading-relaxed">{description}</p>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
					{displayProducts.map((product, index) => (
						<EditorialProductCard key={product.id} product={product} />
					))}
				</div>

				{showViewAll && (
					<div className="mt-16 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center font-label text-[11px] text-foreground/70 hover:text-cobalt transition-colors border-b border-foreground/30 hover:border-cobalt pb-1"
							style={{ borderColor: "rgba(59,46,38,0.3)" }}
						>
							View the full collection
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
