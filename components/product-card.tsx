import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import Link from "next/link";
import { formatFromPrice, modelCode, stockLabel } from "@/lib/brew";
import { cn, isVideoUrl } from "@/lib/utils";
import { YNSMedia } from "@/lib/yns-media";
import { Odometer } from "./brew/odometer";
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
	layout = "card",
}: {
	product: BrowseProduct | CollectionProduct | FullProduct;
	priority?: boolean;
	/** Position on the page, for the spec-sheet model number. */
	index?: number;
	/** Small copper tag in the corner ("House pick"). */
	flag?: string;
	sizes?: string;
	/** "tier": the original's flat machine column (3:4 art, spec rows, rolling price). */
	layout?: "card" | "tier";
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
	const options = variants && variants.length > 1 ? `${variants.length} options` : "Single";
	const category = "category" in product && product.category ? product.category.name : null;
	const spec: [string, string][] = [
		...(category ? ([["Category", category]] as [string, string][]) : []),
		["Options", options],
		["Status", stockLabel(variants)],
	];
	const quickAdd = singleVariant ? (
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
	) : null;

	if (layout === "tier") {
		return (
			<Link
				href={`/product/${product.slug}${variantSearch}`}
				className={cn(
					"group relative flex h-full flex-col border-line py-[clamp(20px,2vw,28px)] transition-colors duration-400 hover:bg-ink/[.02] md:px-[clamp(20px,2vw,28px)]",
					flag && "bg-[linear-gradient(180deg,rgba(200,98,44,.05),transparent_40%)]",
				)}
			>
				{flag && (
					<>
						<span
							aria-hidden="true"
							className="absolute top-0 left-0 h-0.5 w-11 bg-copper md:right-0 md:w-auto"
						/>
						<span className="font-readout absolute top-3.5 right-0 z-[3] rounded-[4px] border border-copper/40 bg-page/60 px-2 py-[3px] text-[0.62rem] font-medium tracking-[0.16em] text-copper uppercase md:right-[clamp(20px,2vw,28px)]">
							{flag}
						</span>
					</>
				)}
				<div className="relative mb-5 aspect-[3/4] max-w-[340px] overflow-hidden rounded-[4px] bg-panel md:max-w-none">
					{quickAdd}
					{primaryImage && !isVideoUrl(primaryImage) && (
						<YNSMedia src={primaryImage} alt="" fill sizes={sizes} className="packshot object-cover" />
					)}
				</div>
				<p className="font-readout text-[0.72rem] tracking-[0.16em] text-faint">
					{modelCode(product.name, index)}
				</p>
				<p className="font-display mt-1 mb-3 text-[2rem] leading-none text-ink [overflow-wrap:anywhere]">
					{product.name}
				</p>
				{summary && <p className="mb-5 line-clamp-3 text-[0.92rem] leading-normal text-dim">{summary}</p>}
				<dl className="font-readout mb-[22px] text-[0.76rem]">
					{spec.map(([label, value]) => (
						<div key={label} className="flex justify-between gap-3.5 border-b border-line-2 py-2">
							<dt className="tracking-[0.06em] text-faint uppercase">{label}</dt>
							<dd className="text-right text-ink">{value}</dd>
						</div>
					))}
				</dl>
				<p className="font-readout mb-[18px] text-[1.6rem] font-medium text-ink">
					{priceDisplay && <Odometer value={priceDisplay} />}
				</p>
				<span className="btn btn-primary mt-auto self-start" aria-hidden="true">
					View <span>&rarr;</span>
				</span>
			</Link>
		);
	}

	return (
		<Link
			href={`/product/${product.slug}${variantSearch}`}
			className="group relative flex h-full flex-col overflow-hidden rounded-[4px] border border-line bg-panel transition-colors duration-300 hover:border-ink/20"
		>
			<div className="relative aspect-square overflow-hidden bg-panel-2">
				{quickAdd}
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
							className={cn("packshot object-cover", secondaryImage && "group-hover:opacity-0")}
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
			<div className="flex flex-1 flex-col p-[clamp(18px,2vw,22px)]">
				<div className="mb-1 flex items-baseline justify-between gap-3">
					<p className="font-readout text-[0.7rem] tracking-[0.16em] text-faint">
						{modelCode(product.name, index)}
					</p>
					<p className="font-readout text-[0.7rem] tracking-[0.08em] text-faint uppercase">
						{stockLabel(variants)}
					</p>
				</div>
				<p className="font-display mb-4 text-[1.6rem] leading-[1.05] text-ink [overflow-wrap:anywhere]">
					{product.name}
				</p>
				<div className="mt-auto flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-line-2 pt-3">
					<p className="font-readout tabular text-[1.12rem] font-medium whitespace-nowrap text-ink">
						{priceDisplay}
					</p>
					<span
						className="font-readout text-[0.78rem] whitespace-nowrap text-copper transition-colors group-hover:text-hot"
						aria-hidden="true"
					>
						View &rarr;
					</span>
				</div>
			</div>
		</Link>
	);
}
