import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatFromPrice, modelCode, stockLabel } from "@/lib/field";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { QuickAddButton } from "./quick-add-button";

type BrowseProduct = APIProductsBrowseResult["data"][number];
type CollectionProduct = APICollectionGetByIdResult["productCollections"][number]["product"];
type FullProduct = NonNullable<APIProductGetByIdResult>;

export async function ProductCard({
	product,
	priority = false,
	index,
	flag,
	sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	/** Position on the page, for the spec-sheet model number. */
	index?: number;
	/** Small orange tag in the corner ("Our pick"). */
	flag?: string;
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
	const options = variants && variants.length > 1 ? `${variants.length} options` : "Single option";

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className={cn(
				"group relative flex flex-col overflow-hidden rounded-[2px] border bg-panel transition-[transform,border-color] duration-400 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-[5px] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
				flag ? "border-signal/40 hover:border-signal/70" : "border-line hover:border-ink/20",
			)}
		>
			{flag && (
				<>
					<span aria-hidden="true" className="absolute inset-x-0 top-0 z-[3] h-[3px] bg-signal" />
					<span className="font-field absolute top-3.5 right-3.5 z-[3] rounded-[2px] bg-signal px-[9px] py-[5px] text-[0.66rem] font-bold tracking-[0.12em] text-page uppercase">
						{flag}
					</span>
				</>
			)}
			<div className="relative aspect-square overflow-hidden bg-panel-2">
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
				{primaryImage &&
					(isVideoUrl(primaryImage) ? (
						<video
							className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${secondaryImage ? "group-hover:opacity-0" : ""}`}
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
								"object-cover brightness-[.9] saturate-[.82] transition-[filter,transform,opacity] duration-500 group-hover:scale-[1.03] group-hover:brightness-[1.02] group-hover:saturate-100 motion-reduce:group-hover:scale-100",
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
			</div>
			<div className="flex flex-1 flex-col px-[22px] pt-[22px] pb-6">
				<p className="font-field mb-0.5 text-[0.76rem] font-bold tracking-[0.14em] text-signal">
					{modelCode(product.name, index)}
				</p>
				<p className="font-display mb-2.5 text-[2rem] text-ink [overflow-wrap:anywhere]">{product.name}</p>
				{summary && <p className="mb-5 line-clamp-3 text-[0.96rem] text-dim">{summary}</p>}
				<dl className="font-field mb-5 flex flex-col text-[0.78rem]">
					<div className="flex justify-between gap-3 border-t border-line-2 py-2">
						<dt className="tracking-[0.08em] text-faint uppercase">Options</dt>
						<dd className="font-bold text-ink">{options}</dd>
					</div>
					<div className="flex justify-between gap-3 border-t border-line-2 py-2">
						<dt className="tracking-[0.08em] text-faint uppercase">Status</dt>
						<dd className="font-bold text-ink">{stockLabel(variants)}</dd>
					</div>
				</dl>
				<div className="mt-auto">
					<span aria-hidden="true" className="hatch mb-3 block h-[5px] w-[34px] opacity-55" />
					<p className="font-display mb-5 text-[2.2rem] tracking-[0.02em] text-ink">{priceDisplay}</p>
					<span className="btn btn-tier" aria-hidden="true">
						View spec <span>→</span>
					</span>
				</div>
			</div>
		</Link>
	);
}
