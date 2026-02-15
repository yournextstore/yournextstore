import { Suspense } from "react";
import { BannerGrid } from "@/components/sections/banner-grid";
import { CategoryShowcase } from "@/components/sections/category-showcase";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { PromoBanner } from "@/components/sections/promo-banner";
import { ServiceFeatures } from "@/components/sections/service-features";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
			<div className="flex items-end justify-between mb-8">
				<div>
					<div className="h-7 w-48 bg-secondary rounded animate-pulse" />
					<div className="mt-2 h-4 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="border border-border">
						<div className="aspect-square bg-secondary animate-pulse" />
						<div className="p-3 sm:p-4 space-y-2">
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
			<BannerGrid />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="What We Offer" description="New arrivals and best sellers" limit={8} />
			</Suspense>
			<PromoBanner />
			<CategoryShowcase />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Popular Products" description="Top-rated parts and accessories" limit={8} />
			</Suspense>
			<ServiceFeatures />
		</main>
	);
}
