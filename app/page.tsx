import { Suspense } from "react";
import { BenefitsBar } from "@/components/sections/benefits-bar";
import { BundleSection } from "@/components/sections/bundle-section";
import { CollectionsCarousel } from "@/components/sections/collections-carousel";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Hero } from "@/components/sections/hero";
import { HotThisWeek } from "@/components/sections/hot-this-week";
import { PressSection } from "@/components/sections/press-section";
import { ProductGrid } from "@/components/sections/product-grid";
import { TextWithImages } from "@/components/sections/text-with-images";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="flex items-end justify-between mb-8">
				<div>
					<div className="h-8 w-48 bg-secondary rounded animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary rounded-lg mb-3 animate-pulse" />
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
			{/* 1. Hero Slideshow */}
			<Hero />

			{/* 2. Product Grid - What's Hot */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="What's hot" limit={8} columns={4} />
			</Suspense>

			{/* 3. Text with Images - "Make you look and feel glowy" */}
			<TextWithImages />

			{/* 4. Collections Carousel */}
			<Suspense>
				<CollectionsCarousel />
			</Suspense>

			{/* 5. Bundle Section */}
			<BundleSection />

			{/* 6. Press Section */}
			<PressSection />

			{/* 7. Hot This Week Cards */}
			<HotThisWeek />

			{/* 8. Benefits Bar */}
			<BenefitsBar />

			{/* 9. CTA Banner */}
			<CtaBanner />

			{/* 10. More Products */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Best Sellers" limit={4} columns={4} viewAllHref="/products" />
			</Suspense>
		</main>
	);
}
