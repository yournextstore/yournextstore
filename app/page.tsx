import { Suspense } from "react";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { FeaturedShowcase } from "@/components/sections/featured-showcase";
import { HeritageStory } from "@/components/sections/heritage-story";
import { Hero } from "@/components/sections/hero";
import { MissionBand } from "@/components/sections/mission-band";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="mb-12 space-y-3">
				<div className="h-3 w-32 bg-[#fbe5ea] rounded animate-pulse" />
				<div className="h-10 w-72 bg-[#fbe5ea] rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-[#fbe5ea] rounded-[20px] mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-[#fbe5ea] rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-[#fbe5ea] rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function ShowcaseSkeleton() {
	return (
		<section className="hayati-showcase py-20">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
				<div className="aspect-[4/5] bg-[#f4c2cb] rounded-[28px] animate-pulse" />
				<div className="space-y-4">
					<div className="h-3 w-24 bg-[#f4c2cb] rounded animate-pulse" />
					<div className="h-12 w-3/4 bg-[#f4c2cb] rounded animate-pulse" />
					<div className="h-6 w-32 bg-[#f4c2cb] rounded animate-pulse" />
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<MissionBand />
			<Suspense fallback={<ShowcaseSkeleton />}>
				<FeaturedShowcase />
			</Suspense>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					eyebrow="Featured tins"
					title="From the pantry"
					description="Slow-blended, hand-poured, and tinned in small batches with our family millers."
					limit={4}
				/>
			</Suspense>
			<Suspense fallback={null}>
				<CollectionGrid />
			</Suspense>
			<HeritageStory />
			<PressStrip />
			<Newsletter />
		</>
	);
}
