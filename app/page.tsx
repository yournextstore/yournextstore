import type { Metadata } from "next";
import { Suspense } from "react";
import { CollectionGrid } from "@/components/sections/collection-grid";
import { FeaturedShowcase } from "@/components/sections/featured-showcase";
import { HeritageStory } from "@/components/sections/heritage-story";
import { Hero } from "@/components/sections/hero";
import { MissionBand } from "@/components/sections/mission-band";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";

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

export const metadata: Metadata = {
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<>
			<Hero />
			<MissionBand />
			<Suspense fallback={<ShowcaseSkeleton />}>
				<FeaturedShowcase />
			</Suspense>
			{/* No <Suspense>: the grid is "use cache", so it renders into the prerendered shell in document order. A boundary
			    around cached data still ships the skeleton first and the content later in the HTML. */}
			<ProductGrid
				eyebrow="Featured tins"
				title="From the pantry"
				description="Slow-blended, hand-poured, and tinned in small batches with our family millers."
				limit={4}
			/>
			<Suspense fallback={null}>
				<CollectionGrid />
			</Suspense>
			<HeritageStory />
			<PressStrip />
			<Newsletter />
		</>
	);
}
