import type { Metadata } from "next";
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

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

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
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Best selling" limit={8} />

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
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid title="Just restocked" limit={4} />

			{/* 10. Athlete Feature */}
			<AthleteFeature />

			{/* 11. Journal */}
			<Journal />

			{/* 12. Newsletter + Store Info */}
			<Newsletter />
		</main>
	);
}
