import { Suspense } from "react";
import { FeaturedCards } from "@/components/sections/featured-cards";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";
import { StatsSection } from "@/components/sections/stats-section";

function ProductGridSkeleton() {
	return (
		<section className="w-full max-w-[1600px] mx-auto px-4 md:px-6 py-8">
			<div className="flex items-end justify-between mb-8">
				<div>
					<div className="h-8 w-48 bg-secondary rounded-2xl animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary rounded-xl animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`} className="bg-card rounded-3xl p-4 shadow-soft">
						<div className="aspect-square bg-secondary rounded-2xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded-xl animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary rounded-xl animate-pulse" />
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
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured Products" description="Premium audio gear for audiophiles" limit={6} />
			</Suspense>
			<FeaturedCards />
			<StatsSection />
		</main>
	);
}
