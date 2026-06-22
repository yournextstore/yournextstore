import { Suspense } from "react";
import { CollectionsGrid } from "@/components/sections/collections-grid";
import { FeaturedProduct } from "@/components/sections/featured-product";
import { Hero } from "@/components/sections/hero";
import { ImageMosaic } from "@/components/sections/image-mosaic";
import { InfoColumns } from "@/components/sections/info-columns";
import { LookbookSection } from "@/components/sections/lookbook-section";
import { MarqueeBanner } from "@/components/sections/marquee-banner";
import { MissionBanner } from "@/components/sections/mission-banner";
import { ProductGrid } from "@/components/sections/product-grid";
import { Testimonials } from "@/components/sections/testimonials";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="flex items-end justify-between mb-10">
				<div className="h-8 w-48 bg-secondary animate-pulse" />
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-10">
				{Array.from({ length: 9 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary mb-3 animate-pulse" />
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
	return <div className="h-64 bg-secondary animate-pulse" />;
}

export default function Home() {
	return (
		<main>
			{/* 1. Hero Slideshow */}
			<Hero />

			{/* 2. Marquee Banner */}
			<MarqueeBanner />

			{/* 3. New Arrivals Product Grid */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="New Arrivals" limit={9} />
			</Suspense>

			{/* 4. Shop Collections */}
			<Suspense fallback={<SectionSkeleton />}>
				<CollectionsGrid />
			</Suspense>

			{/* 5. Second Product Grid */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured" limit={8} showViewAll={false} />
			</Suspense>

			{/* 6. Mission Banner */}
			<MissionBanner />

			{/* 7. Shop by Collection (Lookbook) */}
			<Suspense fallback={<SectionSkeleton />}>
				<LookbookSection />
			</Suspense>

			{/* 8. Testimonials */}
			<Testimonials />

			{/* 9. Featured Product */}
			<Suspense fallback={<SectionSkeleton />}>
				<FeaturedProduct />
			</Suspense>

			{/* 10. Image Mosaic */}
			<ImageMosaic />

			{/* 11. Info Columns (Shipping/Delivery/Returns) */}
			<InfoColumns />
		</main>
	);
}
