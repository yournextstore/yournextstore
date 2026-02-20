import { Suspense } from "react";
import { AboutSection } from "@/components/sections/about-section";
import { BrandsStrip } from "@/components/sections/brands-strip";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
				<div className="h-6 w-48 bg-secondary rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="bg-white rounded-lg border border-border overflow-hidden">
						<div className="aspect-square bg-secondary animate-pulse" />
						<div className="p-4 space-y-2">
							<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/3 bg-secondary rounded animate-pulse" />
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
			{/* 1. Hero with promotional banners */}
			<Hero />

			{/* 2. Product grid (main product listing) */}
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Natural Wellness Products" limit={8} />
			</Suspense>

			{/* 3. Brands/Partners strip */}
			<BrandsStrip />

			{/* 4. About section with store description */}
			<AboutSection />
		</main>
	);
}
