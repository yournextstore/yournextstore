import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowRight, ChevronRight } from "lucide-react";
import { cacheLife } from "next/cache";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSMedia } from "@/lib/yns-media";
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

const SPLASHES = [
	"mush-splash-yellow",
	"mush-splash-blue",
	"mush-splash-lime",
	"mush-splash-peach",
	"mush-splash-cream",
];

const FEELINGS = [
	{ label: "Focus", active: true },
	{ label: "Sleep", active: false },
	{ label: "Clarity", active: false },
	{ label: "Energy", active: false },
	{ label: "Calm", active: false },
];

type AnyProduct = Product | APICollectionGetByIdResult["productCollections"][number]["product"];

function priceFor(product: AnyProduct) {
	const variants = "variants" in product ? product.variants : null;
	if (!variants || variants.length === 0) return null;
	const min = variants.reduce((acc, v) => {
		const p = BigInt(v.price);
		return p < acc ? p : acc;
	}, BigInt(variants[0].price));
	return formatMoney({ amount: min, currency: CURRENCY, locale: LOCALE });
}

export async function ProductGrid({
	title = "Explore the Apothecary",
	description = "Tinctures, powders &amp; rituals — sourced from regenerative Portuguese forests.",
	products,
	limit = 8,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;

	return (
		<section id="products" className="relative mush-cream-gradient">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
				<div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
					{/* Filter rail */}
					<aside className="lg:pt-6">
						<h2 className="font-display text-2xl sm:text-3xl text-[color:var(--color-mush-espresso)] leading-[0.95]">
							What do you
							<br />
							want to feel?
						</h2>
						<ul className="mt-8 space-y-3">
							{FEELINGS.map((f) => (
								<li key={f.label}>
									<button
										type="button"
										className={`group flex w-full items-center justify-between rounded-full border border-[color:var(--color-mush-cream-deep)] px-5 py-2.5 text-sm font-display tracking-[0.18em] uppercase transition-colors ${
											f.active
												? "bg-[color:var(--color-mush-yellow)] text-[color:var(--color-mush-espresso)]"
												: "bg-white text-[color:var(--color-mush-espresso)] hover:bg-[color:var(--color-mush-yellow)]/40"
										}`}
									>
										<span>{f.label}</span>
										<ChevronRight className="h-4 w-4" />
									</button>
								</li>
							))}
						</ul>
						<YnsLink
							prefetch={"eager"}
							href={viewAllHref}
							className="mt-10 inline-flex items-center gap-1 text-sm font-display tracking-[0.18em] uppercase text-[color:var(--color-mush-caramel)] hover:text-[color:var(--color-mush-espresso)]"
						>
							View all
							<ArrowRight className="h-4 w-4" />
						</YnsLink>
					</aside>

					{/* Product strip */}
					<div className="relative -mx-4 sm:mx-0">
						<div className="mb-6 flex items-end justify-between px-4 sm:px-0">
							<div>
								<p className="font-script text-2xl text-[color:var(--color-mush-caramel)]">Apothecary</p>
								<h3 className="font-display text-3xl sm:text-4xl text-[color:var(--color-mush-espresso)] tracking-tight">
									{title}
								</h3>
							</div>
						</div>
						<div className="flex gap-6 overflow-x-auto pb-6 px-4 sm:px-0 snap-x snap-mandatory">
							{displayProducts.map((product, idx) => (
								<SplashCard key={product.id} product={product} splash={SPLASHES[idx % SPLASHES.length]} />
							))}
						</div>
						{showViewAll && (
							<div className="mt-8 text-center sm:text-left px-4 sm:px-0">
								<YnsLink
									prefetch={"eager"}
									href={viewAllHref}
									className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-mush-espresso)] px-6 py-3 font-display text-xs tracking-[0.22em] uppercase text-[color:var(--color-mush-cream)] hover:bg-[color:var(--color-mush-caramel)] transition-colors"
								>
									Browse all products
									<ArrowRight className="h-4 w-4" />
								</YnsLink>
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

function SplashCard({ product, splash }: { product: AnyProduct; splash: string }) {
	const image = product.images?.[0] ?? null;
	const price = priceFor(product);

	return (
		<YnsLink
			prefetch={"eager"}
			href={`/product/${product.slug}`}
			className="group relative w-[240px] sm:w-[280px] shrink-0 snap-start"
		>
			<div className="relative aspect-[4/5] overflow-hidden">
				<div className={`absolute inset-x-4 inset-y-8 ${splash} rounded-[55%]`} />
				{image && (
					<div className="absolute inset-0 flex items-end justify-center pb-4">
						<div className="relative h-[88%] w-[78%] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-2deg]">
							<YNSMedia
								src={image}
								alt={product.name}
								fill
								sizes="(max-width: 640px) 60vw, 280px"
								className="object-contain drop-shadow-[0_25px_25px_rgba(61,31,15,0.25)]"
							/>
						</div>
					</div>
				)}
			</div>
			<div className="mt-4 text-center">
				<h4 className="font-display text-base text-[color:var(--color-mush-espresso)] uppercase tracking-wide">
					{product.name}
				</h4>
				{price && (
					<p className="mt-1 text-sm text-[color:var(--color-mush-caramel)] font-semibold">{price}</p>
				)}
			</div>
		</YnsLink>
	);
}
