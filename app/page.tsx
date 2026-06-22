import { Suspense } from "react";
import { AthleteFeature } from "@/components/sections/athlete-feature";
import { CollectionCards } from "@/components/sections/collection-cards";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { GiftCards } from "@/components/sections/gift-cards";
import { Hero } from "@/components/sections/hero";
import { Journal } from "@/components/sections/journal";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";
import { Testimonials } from "@/components/sections/testimonials";
import { VideoSection } from "@/components/sections/video-section";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-8 w-48 bg-secondary animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary mb-3 animate-pulse" />
						<div className="space-y-2">
							<div className="h-4 w-3/4 bg-secondary animate-pulse" />
							<div className="h-4 w-1/4 bg-secondary animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function CollectionSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="h-4 w-24 bg-secondary animate-pulse mx-auto mb-8" />
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
				<div className="aspect-[4/3] bg-secondary animate-pulse" />
				<div className="aspect-[4/3] bg-secondary animate-pulse" />
			</div>
		</section>
	);
}

function CollectionGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`cg-skeleton-${i}`} className="aspect-[4/3] bg-secondary animate-pulse" />
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			{/* 1. Hero Slideshow */}
			<Hero />

			{/* 2. Collection Cards - Top picks */}
			<Suspense fallback={<CollectionSkeleton />}>
				<CollectionCards />
			</Suspense>

			{/* 3. Best Selling Products */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Best selling" limit={8} />
			</Suspense>

			{/* 4. Promo Banner - Summer wear */}
			<PromoBanner />

			{/* 5. Video/Into the wild section */}
			<VideoSection />

			{/* 6. Gift Cards */}
			<GiftCards />

			{/* 7. Collection Grid */}
			<Suspense fallback={<CollectionGridSkeleton />}>
				<CollectionGrid />
			</Suspense>

			{/* 8. Testimonials */}
			<Testimonials />

			{/* 9. Just Restocked Products */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Just restocked" limit={4} />
			</Suspense>

			{/* 10. Athlete Feature */}
			<AthleteFeature />

			{/* 11. Journal */}
			<Journal />

			{/* 12. Newsletter + Store Info */}
			<Newsletter />
		</main>
	);
}
