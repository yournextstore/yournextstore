import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { YnsLink } from "../yns-link";

export type Product = APIProductsBrowseResult["data"][number];

type ProductGridProps = {
	title?: string;
	description?: string;
	products?: (
		| Product
		| APICollectionGetByIdResult["productCollections"][number]["product"]
		| NonNullable<APIProductGetByIdResult>
	)[];
	limit?: number;
	showViewAll?: boolean;
	viewAllHref?: string;
};

export async function ProductGrid({
	title = "TREAT YOURSELF TO THE NICEST FINDS",
	description = "CHECK OUT OUR GIRLS",
	products,
	limit = 6,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative bg-[var(--pink)] pb-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20">
				<div className="text-center mb-2">
					<h2 className="font-display uppercase text-white text-[clamp(1.75rem,4vw,3.25rem)] leading-[1] tracking-tight">
						{title}
					</h2>
					<p className="mt-3 font-display uppercase tracking-[0.32em] text-white/85 text-xs sm:text-sm">
						{description}
					</p>
				</div>

				{/* Squiggle doodle accent */}
				<div className="flex justify-center mb-10">
					<svg width="80" height="20" viewBox="0 0 80 20" fill="none" aria-hidden="true">
						<title>doodle</title>
						<path
							d="M2 10 Q 10 2, 18 10 T 34 10 T 50 10 T 66 10 T 78 10"
							stroke="white"
							strokeWidth="2"
							strokeLinecap="round"
							fill="none"
						/>
					</svg>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
					{displayProducts.map((product, idx) => (
						<div key={product.id} className="relative">
							<StickerBadge index={idx} />
							<div className="rounded-2xl bg-white/95 p-3 sm:p-4 shadow-xl hover:-translate-y-1 transition-transform">
								<ProductCard product={product} />
							</div>
						</div>
					))}
				</div>

				{showViewAll && (
					<div className="mt-14 text-center">
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="inline-flex items-center justify-center h-12 px-9 rounded-full bg-white text-[var(--pink)] font-display tracking-[0.18em] text-xs uppercase shadow-lg hover:scale-[1.03] transition-all"
						>
							Shop All
						</YnsLink>
					</div>
				)}
			</div>
		</section>
	);
}

const stickers: Array<{ color: string; text: string }> = [
	{ color: "var(--sky)", text: "NICE!" },
	{ color: "var(--tangerine)", text: "SAVOURY!" },
	{ color: "var(--yellow)", text: "SWEET!" },
	{ color: "var(--cream)", text: "FRESH" },
	{ color: "var(--pink-soft)", text: "FLIRTY" },
	{ color: "var(--sky)", text: "SMOKED" },
];

function StickerBadge({ index }: { index: number }) {
	const s = stickers[index % stickers.length] ?? stickers[0];
	if (!s) return null;
	const rotation = index % 2 === 0 ? "-rotate-12" : "rotate-12";
	return (
		<div
			className={`absolute -top-4 -left-2 z-10 yns-starburst flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 ${rotation}`}
			style={{ background: s.color }}
		>
			<span className="font-display text-[var(--burgundy)] text-[10px] sm:text-xs tracking-widest">
				{s.text}
			</span>
		</div>
	);
}
