import { Suspense } from "react";
import { BigDealsBanner } from "@/components/sections/big-deals-banner";
import { BrandBanner } from "@/components/sections/brand-banner";
import { Hero } from "@/components/sections/hero";
import { InstagramGrid } from "@/components/sections/instagram-grid";
import { ProductGrid } from "@/components/sections/product-grid";
import { ScrollingMarquee } from "@/components/sections/scrolling-marquee";
import { ShopTheLook } from "@/components/sections/shop-the-look";
import { Testimonials } from "@/components/sections/testimonials";
import { TopCollections } from "@/components/sections/top-collections";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-8 w-48 bg-secondary rounded animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary mb-3 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<Suspense>
				<TopCollections />
			</Suspense>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Best Selling" limit={8} />
			</Suspense>
			<ShopTheLook outfitImage="/scraped-3.png" outfitAlt="Shop the look outfit 1" />
			<BigDealsBanner />
			<ShopTheLook outfitImage="/scraped-4.png" outfitAlt="Shop the look outfit 2" flipped />
			<ScrollingMarquee />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Trending Outfits"
					description="Unmatched design—superior performance and customer satisfaction in one."
					limit={8}
					showViewAll={false}
				/>
			</Suspense>
			<Testimonials />
			<BrandBanner />
			<InstagramGrid />
		</main>
	);
}
