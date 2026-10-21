import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { Faceplate } from "@/components/rack/faceplate";
import { formatFromPrice, modelCode, plateName, stockTag } from "@/lib/rack";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

/** The original's module card: a faceplate on a dark stage, then name and price, a mono spec line, a note and a stock tag. */
export async function ProductCard({
	product,
	priority = false,
	index,
	sizes = "(max-width: 580px) 40vw, (max-width: 940px) 20vw, 160px",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	/** Position on the page, for the model number. */
	index?: number;
	sizes?: string;
}) {
	const variants = "variants" in product ? product.variants : null;
	const priceDisplay = await formatFromPrice(variants);

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

	const summary = "summary" in product ? product.summary : null;
	const tag = stockTag(variants);
	const spec = [
		modelCode(product.name, index),
		variants && variants.length > 1 ? `${variants.length} builds` : "single build",
		"category" in product && product.category ? product.category.name.toLowerCase() : null,
	]
		.filter(Boolean)
		.join(" · ");

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className="panel-card lift group relative flex flex-col overflow-hidden"
		>
			<div className="relative grid aspect-[16/9] place-items-center border-b border-line bg-[linear-gradient(160deg,var(--rk-bg),var(--rk-bg-2))]">
				<Faceplate
					legend={plateName(product.name)}
					led={tag.tone === "ok" ? "amber" : "green"}
					className="w-[40%]"
				>
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
								sizes={sizes}
								className={cn(
									"object-cover transition-opacity duration-500",
									secondaryImage && "group-hover:opacity-0",
								)}
								priority={priority}
							/>
						))}
					{secondaryImage && !isVideoUrl(secondaryImage) && (
						<YNSMedia
							src={secondaryImage}
							alt=""
							fill
							sizes={sizes}
							className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						/>
					)}
				</Faceplate>
				{singleVariant && (
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
				)}
			</div>
			<div className="flex flex-1 flex-col px-[1.2rem] pt-[1.1rem] pb-[1.3rem]">
				<div className="flex items-baseline justify-between gap-[0.6rem]">
					<p className="font-display min-w-0 text-[1.25rem] text-ink [overflow-wrap:anywhere]">
						{product.name}
					</p>
					{priceDisplay && (
						<span className="font-plate shrink-0 text-[0.95rem] whitespace-nowrap text-ink">
							{priceDisplay}
						</span>
					)}
				</div>
				<p className="font-plate mt-2 mb-[0.2rem] text-[0.72rem] text-faint">{spec}</p>
				{summary && <p className="mt-2 mb-[0.9rem] line-clamp-3 text-[0.9rem] text-dim">{summary}</p>}
				<span className={cn("tag mt-auto self-start", tag.tone === "ok" ? "tag-ok" : "tag-soon")}>
					{tag.label}
				</span>
			</div>
		</Link>
	);
}
