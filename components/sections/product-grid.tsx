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
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];

type AnyProduct =
	| Product
	| APICollectionGetByIdResult["productCollections"][number]["product"]
	| NonNullable<APIProductGetByIdResult>;

type ProductGridProps = {
	title?: string;
	description?: string;
	products?: AnyProduct[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
};

const STAGE_CLASSES = [
	"muse-blur-stage-lilac",
	"muse-blur-stage-sage",
	"muse-blur-stage-terracotta",
	"muse-blur-stage-mint",
];

const NOTE_FALLBACKS = [
	"Honeydew, Cotton Flower, Blue Tansy, Lilac",
	"Fir Needle, Hinoki Wood, Sage, Oakmoss",
	"Wild Bergamot, Patchouli Leaf, Amber, Musk",
	"Unscented",
];

function getNotes(product: AnyProduct, index: number): string {
	const description = "description" in product ? product.description : null;
	if (typeof description === "string" && description.length > 0) {
		const text = description.replace(/<[^>]*>/g, "").trim();
		if (text.length > 0) {
			return text.length > 60 ? `${text.slice(0, 60).trim()}…` : text;
		}
	}
	return NOTE_FALLBACKS[index % NOTE_FALLBACKS.length];
}

export async function ProductGrid({
	title = "domino",
	description = "“Best Scented Laundry Essential”",
	products,
	limit = 4,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts: AnyProduct[] =
		products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="bg-background">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
				{/* Editorial pull-quote header */}
				<div className="text-center mb-14 sm:mb-20">
					<p className="font-serif italic text-[13px] sm:text-sm text-foreground/70 tracking-wide">
						{description}
					</p>
					<h2 className="mt-1 font-serif italic text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight text-foreground">
						{title}
					</h2>
				</div>

				{/* 4-up product showcase */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-12 sm:gap-y-16">
					{displayProducts.slice(0, limit).map((product, idx) => {
						const variants = "variants" in product ? product.variants : null;
						const firstVariantPrice = variants?.[0] ? BigInt(variants[0].price) : null;
						const priceDisplay = firstVariantPrice
							? formatMoney({ amount: firstVariantPrice, currency: CURRENCY, locale: LOCALE })
							: null;
						const allImages = [
							...(product.images ?? []),
							...(variants?.flatMap((v) => v.images ?? []) ?? []),
						];
						const primaryImage = allImages[0];
						const stage = STAGE_CLASSES[idx % STAGE_CLASSES.length];
						const notes = getNotes(product, idx);

						return (
							<YnsLink
								prefetch={"eager"}
								key={product.id}
								href={`/product/${product.slug}`}
								className="group block"
							>
								<div
									className={`relative aspect-[4/5] overflow-hidden ${stage} flex items-center justify-center`}
								>
									{/* Soft inner vignette */}
									<div
										aria-hidden="true"
										className="absolute inset-0 backdrop-blur-[2px]"
										style={{
											background:
												"radial-gradient(ellipse at center, transparent 30%, rgba(255,255,255,0.18) 100%)",
										}}
									/>
									{primaryImage &&
										(isVideoUrl(primaryImage) ? (
											<video
												className="relative z-10 max-h-[78%] max-w-[60%] object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)] transition-transform duration-700 group-hover:scale-[1.03]"
												src={primaryImage}
												muted
												loop
												autoPlay
												playsInline
											/>
										) : (
											<div className="relative z-10 w-[64%] h-[78%]">
												<YNSMedia
													src={primaryImage}
													alt={product.name}
													fill
													sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
													className="object-contain drop-shadow-[0_18px_30px_rgba(0,0,0,0.18)] transition-transform duration-700 group-hover:scale-[1.03]"
												/>
											</div>
										))}
								</div>
								<div className="mt-6 text-center px-2">
									<h3 className="font-serif text-[22px] sm:text-2xl tracking-[0.18em] uppercase font-light text-foreground">
										{product.name}
									</h3>
									<p className="mt-2 font-serif italic text-[13px] text-foreground/60 leading-snug">
										{notes}
									</p>
									{priceDisplay && (
										<p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-foreground/50">
											{priceDisplay}
										</p>
									)}
								</div>
							</YnsLink>
						);
					})}
				</div>

				{showViewAll && (
					<div className="mt-14 sm:mt-16 flex justify-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center justify-center h-11 px-7 rounded-full bg-[var(--ink)] text-[var(--ivory)] text-[13px] tracking-wide hover:bg-foreground/85 transition-colors"
						>
							Shop Detergent Sheets
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}
