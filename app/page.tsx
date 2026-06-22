import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PopularCategories } from "@/components/sections/popular-categories";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { StoryBand } from "@/components/sections/story-band";
import { Sustainability } from "@/components/sections/sustainability";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-4 w-32 bg-secondary rounded animate-pulse mb-3" />
					<div className="h-8 w-56 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary mb-3 animate-pulse" />
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
		<>
			<Hero />
			<PopularCategories />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					eyebrow="Shop by activity"
					title="Built for every move"
					description="From your morning miles to your post-yoga walk — pieces engineered to perform across running, training, and recovery."
					limit={8}
					columns={4}
				/>
			</Suspense>
			<StoryBand />
			<PressStrip />
			<Sustainability />
			<Newsletter />
		</>
	);
}
