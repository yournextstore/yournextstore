import { Suspense } from "react";
import { CategoryTiles } from "@/components/sections/category-tiles";
import { EditorialBanner } from "@/components/sections/editorial-banner";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { StoryStrip } from "@/components/sections/story-strip";
import { UgcCarousel } from "@/components/sections/ugc-carousel";

function ProductGridSkeleton() {
	return (
		<section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
			<div className="mb-12 flex flex-col items-center justify-center gap-2 text-center">
				<div className="h-3 w-24 animate-pulse rounded bg-secondary" />
				<div className="h-12 w-72 animate-pulse rounded bg-secondary" />
				<div className="h-4 w-96 animate-pulse rounded bg-secondary" />
			</div>
			<div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-4">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="mb-4 aspect-[4/5] animate-pulse rounded-sm bg-secondary" />
						<div className="space-y-2 px-1">
							<div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
							<div className="h-4 w-1/4 animate-pulse rounded bg-secondary" />
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
			<CategoryTiles />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					eyebrow="The Edit"
					title="Bestsellers"
					description="Loved on repeat — the pieces our customers can't stop reordering."
					limit={8}
				/>
			</Suspense>
			<EditorialBanner />
			<StoryStrip />
			<UgcCarousel />
			<Newsletter />
		</>
	);
}
