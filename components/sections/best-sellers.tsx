import type { APIProductsBrowseResult } from "commerce-kit";
import { ArrowRight, StarIcon } from "lucide-react";
import { cacheLife } from "next/cache";
import { ProductCard } from "@/components/product-card";
import { commerce } from "@/lib/commerce";
import { CURRENCY, LOCALE } from "@/lib/constants";
import { formatMoney } from "@/lib/money";
import { YNSMedia } from "@/lib/yns-media";
import { YnsLink } from "../yns-link";

type Product = APIProductsBrowseResult["data"][number];

function FeaturedHero({ product }: { product: Product }) {
	const firstVariant = product.variants?.[0];
	const price = firstVariant ? BigInt(firstVariant.price) : null;
	const priceLabel = price ? formatMoney({ amount: price, currency: CURRENCY, locale: LOCALE }) : null;
	const image = product.images?.[0] ?? firstVariant?.images?.[0];

	return (
		<YnsLink
			prefetch={"eager"}
			href={`/product/${product.slug}`}
			className="group block relative overflow-hidden rounded-3xl bg-brand text-brand-foreground p-7 sm:p-9 min-h-[460px] flex flex-col justify-between"
		>
			<svg
				aria-hidden="true"
				viewBox="0 0 400 400"
				className="absolute inset-0 h-full w-full opacity-20 mix-blend-screen"
				preserveAspectRatio="none"
			>
				<defs>
					<radialGradient id="bs-glow" cx="20%" cy="0%" r="80%">
						<stop offset="0%" stopColor="#d4c5a9" stopOpacity="0.5" />
						<stop offset="100%" stopColor="#0e4f3f" stopOpacity="0" />
					</radialGradient>
				</defs>
				<rect width="400" height="400" fill="url(#bs-glow)" />
			</svg>

			<div className="relative">
				<p className="text-[10px] uppercase tracking-[0.25em] text-cream/70">Top of the chart</p>
				<h3 className="mt-3 font-display text-4xl sm:text-5xl text-cream leading-[1.05]">
					Best Selling
					<br />
					<span className="italic text-sand">Product</span>
				</h3>
				<p className="mt-3 max-w-xs text-sm text-cream/70 leading-relaxed">
					Trusted by over twelve thousand parents this year alone.
				</p>
			</div>

			<div className="relative mt-8 flex items-end justify-between gap-4">
				<div>
					<p className="font-display text-2xl text-cream">{product.name}</p>
					<div className="mt-2 flex items-center gap-2 text-cream/80 text-xs">
						<span className="inline-flex items-center gap-0.5">
							{Array.from({ length: 5 }).map((_, i) => (
								<StarIcon key={`star-${i}`} className="h-3 w-3 fill-sand text-sand" />
							))}
						</span>
						{priceLabel && <span className="font-semibold text-cream">{priceLabel}</span>}
					</div>
				</div>
				<span className="inline-flex h-11 items-center gap-1.5 rounded-full bg-cream/10 px-4 text-xs font-medium text-cream group-hover:bg-cream group-hover:text-brand transition-colors">
					Shop
					<ArrowRight className="h-3.5 w-3.5" />
				</span>
			</div>

			{image && (
				<div className="pointer-events-none absolute -bottom-6 -right-6 h-56 w-56 sm:h-72 sm:w-72 rounded-2xl overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-500">
					<YNSMedia src={image} alt={product.name} fill className="object-cover" sizes="300px" />
				</div>
			)}
		</YnsLink>
	);
}

export async function BestSellers() {
	"use cache";
	cacheLife("minutes");

	const result = await commerce.productBrowse({ active: true, limit: 5 });
	const all = result.data;
	if (all.length === 0) return null;

	const featured = all[0];
	const rest = all.slice(1, 5);

	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="flex items-end justify-between mb-10">
				<div>
					<p className="text-xs uppercase tracking-[0.25em] text-brand/60">Customer favourites</p>
					<h2 className="mt-3 font-display text-3xl sm:text-4xl text-foreground">Top 10 Best Sellers</h2>
				</div>
				<YnsLink
					href="/products"
					className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-brand hover:text-brand/70 transition-colors"
				>
					Discover more
					<ArrowRight className="h-4 w-4" />
				</YnsLink>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
				<div className="lg:col-span-5">
					<FeaturedHero product={featured} />
				</div>
				<div className="lg:col-span-7 grid grid-cols-2 gap-5 sm:gap-6">
					{rest.map((p) => (
						<ProductCard key={p.id} product={p} />
					))}
				</div>
			</div>
		</section>
	);
}
