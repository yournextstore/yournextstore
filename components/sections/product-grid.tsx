import type {
	APICollectionGetByIdResult,
	APIProductGetByIdResult,
	APIProductsBrowseResult,
} from "commerce-kit";
import { ArrowUpRight } from "lucide-react";
import { cacheLife } from "next/cache";
import Image from "next/image";
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

function PromoBanner() {
	return (
		<YnsLink
			prefetch={"eager"}
			href="/products"
			className="group relative overflow-hidden rounded-[1.75rem] aspect-[4/5] ring-1 ring-black/5 shadow-[0_8px_30px_-12px_rgba(255,107,53,0.45)]"
		>
			<div className="absolute inset-0 bg-gradient-to-br from-[#ff8a5b] via-[#ff6b35] to-[#ef4f17]" />
			<Image
				src="/scraped-5.jpg"
				alt=""
				fill
				sizes="(max-width: 1024px) 50vw, 25vw"
				className="object-cover object-right-bottom mix-blend-luminosity opacity-90 group-hover:scale-105 transition-transform duration-500"
				aria-hidden="true"
			/>
			<div className="absolute inset-0 bg-gradient-to-br from-[#ff6b35]/85 via-[#ff6b35]/55 to-transparent" />
			<div className="relative h-full p-5 sm:p-6 flex flex-col justify-between text-white">
				<h3 className="font-display uppercase text-2xl sm:text-3xl lg:text-[2.1rem] leading-[0.95] tracking-tight">
					20% off on
					<br /> furniture
					<br /> tops
				</h3>
				<div className="flex items-end justify-between gap-3">
					<svg
						viewBox="0 0 80 60"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						className="h-10 w-12 opacity-90"
						aria-hidden="true"
					>
						<path d="M5 50 C 15 20, 40 10, 70 25" />
						<path d="M70 25 L 60 20 M70 25 L 65 35" />
					</svg>
					<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#ff6b35]">
						<ArrowUpRight className="h-4 w-4" />
					</span>
				</div>
			</div>
		</YnsLink>
	);
}

function BrandCard() {
	return (
		<div className="grid grid-rows-[1fr_auto] gap-3 sm:gap-4">
			<div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#5d8bff] via-[#2f62f6] to-[#1c46d0] ring-1 ring-black/5 shadow-[0_8px_30px_-12px_rgba(47,98,246,0.45)] aspect-[5/4]">
				<svg
					viewBox="0 0 200 200"
					className="absolute -right-10 -bottom-10 h-44 w-44 opacity-15 text-white"
					aria-hidden="true"
				>
					<circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="2" />
					<circle cx="100" cy="100" r="55" fill="none" stroke="currentColor" strokeWidth="2" />
					<circle cx="100" cy="100" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
				</svg>
				<div className="relative h-full p-5 flex flex-col justify-between text-white">
					<div className="flex items-start justify-between">
						<span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#0f0f0f]">
							<svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
								<path
									d="M5 19V9l7-5 7 5v10h-4v-6h-6v6H5z"
									stroke="currentColor"
									strokeWidth="1.6"
									strokeLinejoin="round"
								/>
							</svg>
						</span>
						<span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/15 text-white">
							<ArrowUpRight className="h-3.5 w-3.5" />
						</span>
					</div>
					<div>
						<p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">YNS</p>
						<p className="mt-2 font-display text-xl sm:text-2xl leading-[1.05]">
							20 Years Shopping Experience
						</p>
					</div>
				</div>
			</div>
			<div className="rounded-[1.75rem] bg-white ring-1 ring-black/5 p-4 sm:p-5 shadow-[0_4px_18px_-12px_rgba(15,15,15,0.15)] flex items-start gap-3">
				<span className="shrink-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ff6b35] text-white">
					<ArrowUpRight className="h-4 w-4" />
				</span>
				<div>
					<p className="font-display text-base sm:text-lg leading-tight text-[#0f0f0f]">
						Raining Offers
						<br />
						For Summer!
					</p>
					<p className="mt-1 text-xs text-neutral-500">Here we are, creative looks and modern ideas.</p>
				</div>
			</div>
		</div>
	);
}

export async function ProductGrid({
	title = "Featured Furniture",
	description = "Handpicked pieces for design-conscious spaces",
	products,
	limit = 3,
	showViewAll = true,
	viewAllHref = "/products",
}: ProductGridProps) {
	"use cache";
	cacheLife("minutes");

	const displayProducts = products ?? (await commerce.productBrowse({ active: true, limit })).data;
	const productSlice = displayProducts.slice(0, 3);

	return (
		<section
			id="products"
			className="mt-4 sm:mt-5 rounded-[2rem] bg-white p-4 sm:p-6 lg:p-8 ring-1 ring-black/5 shadow-[0_4px_24px_-12px_rgba(15,15,15,0.08)]"
		>
			<div className="flex items-end justify-between mb-5 sm:mb-7 px-1">
				<div>
					<h2 className="font-display uppercase text-2xl sm:text-3xl text-[#0f0f0f] leading-tight">
						{title}
					</h2>
					<p className="mt-1.5 text-sm text-neutral-500">{description}</p>
				</div>
				{showViewAll && (
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f0f0f] hover:text-[#ff6b35] transition-colors"
					>
						View all
						<ArrowUpRight className="h-4 w-4" />
					</YnsLink>
				)}
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
				{productSlice.map((product) => (
					<ProductCard key={product.id} product={product} />
				))}
				<div className="hidden lg:block">
					<PromoBanner />
				</div>
				<div className="hidden lg:block">
					<BrandCard />
				</div>
				{/* Mobile/tablet versions */}
				<div className="lg:hidden">
					<PromoBanner />
				</div>
				<div className="lg:hidden sm:col-span-2">
					<BrandCard />
				</div>
			</div>

			{showViewAll && (
				<div className="mt-8 text-center sm:hidden">
					<YnsLink
						prefetch={"eager"}
						href={viewAllHref}
						className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0f0f0f]"
					>
						View all products
						<ArrowUpRight className="h-4 w-4" />
					</YnsLink>
				</div>
			)}
		</section>
	);
}
