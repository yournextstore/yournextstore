import { Suspense } from "react";
import { AthleteFeature } from "@/components/sections/athlete-feature";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { CollectionPicks } from "@/components/sections/collection-picks";
import { GiftCards } from "@/components/sections/gift-cards";
import { Hero } from "@/components/sections/hero";
import { Journal } from "@/components/sections/journal";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";
import { Testimonials } from "@/components/sections/testimonials";
import { VideoBanner } from "@/components/sections/video-banner";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="flex items-end justify-between mb-8">
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

function SectionSkeleton() {
	return <div className="h-64 bg-secondary/30 animate-pulse" />;
}

export default function Home() {
	return (
		<main>
			{/* 1. Hero slideshow */}
			<Hero />

			{/* 2. Top picks — collection cards */}
			<Suspense fallback={<SectionSkeleton />}>
				<CollectionPicks />
			</Suspense>

			{/* 3. Best selling products grid */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Best selling" limit={8} />
			</Suspense>

			{/* 4. Summer wear promo banner */}
			<PromoBanner />

			{/* 5. Into the wild — video/cinematic banner */}
			<VideoBanner />

			{/* 6. Gift cards section */}
			<GiftCards />

			{/* 7. Collection grid */}
			<Suspense fallback={<SectionSkeleton />}>
				<CollectionGrid />
			</Suspense>

			{/* 8. Testimonials */}
			<Testimonials />

			{/* 9. Just restocked — another product grid */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Just restocked" limit={4} />
			</Suspense>

			{/* 10. Athlete feature */}
			<AthleteFeature />

			{/* 11. From the journal */}
			<Journal />
		</main>
	);
}
