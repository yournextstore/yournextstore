import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { Eye } from "lucide-react";
import Link from "next/link";
import { formatMoney } from "@/lib/money";
import { priceRange } from "@/lib/pricing";
import { getStoreConfig } from "@/lib/store-config";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { LogoMark } from "./logo-mark";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export async function ProductCard({
	product,
	priority = false,
	headingLevel = "h3",
	className,
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	/** h2 on listings that open with an h1, h3 under a section heading. */
	headingLevel?: "h2" | "h3";
	className?: string;
}) {
	const { currency, locale, taxBehavior } = await getStoreConfig();
	const variants = "variants" in product ? product.variants : null;
	const { min: minPrice, max: maxPrice } =
		variants && variants.length > 0 ? priceRange(variants, taxBehavior) : { min: null, max: null };

	const priceDisplay =
		variants && variants.length > 1 && minPrice && maxPrice && minPrice !== maxPrice
			? `${formatMoney({ amount: minPrice, currency, locale })} - ${formatMoney({ amount: maxPrice, currency, locale })}`
			: minPrice
				? formatMoney({ amount: minPrice, currency, locale })
				: null;

	const allImages = [
		...(product.images ?? []),
		...(variants?.flatMap((v) => v.images ?? []).filter((img) => !(product.images ?? []).includes(img)) ??
			[]),
	];
	const primaryImage = allImages[0];
	const secondaryImage = allImages[1];

	const singleVariant = variants?.length === 1 && variants[0]?.stock !== 0 ? variants[0] : null;

	// A single-variant card deep-links to that variant; a bare link would show the product's default.
	const onlyVariant = variants?.length === 1 ? variants[0] : null;
	const variantSearch = (() => {
		if (!onlyVariant || !("combinations" in onlyVariant) || onlyVariant.combinations.length === 0) {
			return "";
		}
		const params = new URLSearchParams();
		for (const combination of onlyVariant.combinations) {
			params.set(combination.variantValue.variantType.label, combination.variantValue.value);
		}
		return `?${params.toString()}`;
	})();

	const href = `/product/${product.slug}${variantSearch}`;
	const Title = headingLevel;
	const chooseOptions = !singleVariant && (variants?.length ?? 0) > 1;

	// The original's shadcn Card: 1px border, image over a border-b, name + price, then a
	// full-width "Add to cart" beside a square "Preview" button.
	return (
		<article
			className={cn(
				"group relative flex size-full flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow",
				className,
			)}
		>
			<Link href={href} tabIndex={-1} aria-hidden="true" className="block border-b">
				<div className="relative aspect-[3/4] bg-secondary">
					{primaryImage &&
						(isVideoUrl(primaryImage) ? (
							<video
								className="absolute inset-0 h-full w-full object-cover"
								src={primaryImage}
								muted
								loop
								autoPlay
								playsInline
							/>
						) : (
							<YNSMedia
								src={primaryImage}
								alt=""
								fill
								sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 480px) 50vw, 100vw"
								className={`object-cover transition-opacity duration-500 ${secondaryImage && !isVideoUrl(secondaryImage) ? "group-hover:opacity-0" : ""}`}
								priority={priority}
							/>
						))}
					{primaryImage ? null : (
						<div className="absolute inset-0 flex items-center justify-center text-muted-foreground/60">
							<LogoMark className="size-12" />
						</div>
					)}
					{secondaryImage && !isVideoUrl(secondaryImage) ? (
						<YNSMedia
							src={secondaryImage}
							alt=""
							fill
							sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 480px) 50vw, 100vw"
							className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					) : null}
				</div>
			</Link>
			<div className="flex-1 space-y-1.5 p-4">
				<Title className="line-clamp-1 font-semibold leading-tight tracking-tight">
					<Link href={href} className="hover:underline">
						{product.name}
					</Link>
				</Title>
				<p className="line-clamp-1 text-sm text-muted-foreground">{priceDisplay}</p>
			</div>
			<div className="flex items-center gap-2 p-4 pt-1">
				{singleVariant ? (
					<QuickAddButton
						variantId={singleVariant.id}
						variantSku={"sku" in singleVariant ? singleVariant.sku : null}
						variantPrice={singleVariant.price}
						variantPriceGross={"priceGross" in singleVariant ? singleVariant.priceGross : null}
						variantImages={singleVariant.images}
						product={{
							id: product.id,
							name: product.name,
							slug: product.slug,
							images: product.images ?? [],
						}}
					/>
				) : (
					<Link
						href={href}
						aria-label={`${chooseOptions ? "Choose options" : "View product"}, ${product.name}`}
						className="inline-flex h-8 w-full items-center justify-center rounded-sm bg-primary px-3 text-xs font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
					>
						{chooseOptions ? "Choose options" : "View product"}
					</Link>
				)}
				<Link
					href={href}
					title="Preview"
					className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-secondary text-secondary-foreground shadow-xs transition-colors hover:bg-secondary/80"
				>
					<Eye className="size-4" aria-hidden="true" />
					<span className="sr-only">Preview {product.name}</span>
				</Link>
			</div>
		</article>
	);
}
