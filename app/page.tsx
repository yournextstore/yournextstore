import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { EditorialTiles } from "@/components/sections/editorial-tiles";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";
import { Storytelling } from "@/components/sections/storytelling";
import { TrendingRail } from "@/components/sections/trending-rail";

function ProductGridSkeleton() {
	return (
		<section className="mx-auto max-w-[1600px] px-6 py-20 lg:px-10">
			<div className="mb-10">
				<div className="h-3 w-20 bg-secondary animate-pulse" />
				<div className="mt-4 h-9 w-72 bg-secondary animate-pulse" />
			</div>
			<div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[3/4] bg-secondary animate-pulse" />
						<div className="mt-3.5 space-y-2">
							<div className="h-3 w-3/4 bg-secondary animate-pulse" />
							<div className="h-3 w-1/4 bg-secondary animate-pulse" />
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
			<EditorialTiles />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					eyebrow="New In"
					title="Just Arrived"
					description="Considered pieces from this season's collection."
					limit={8}
				/>
			</Suspense>
			<Storytelling />
			<TrendingRail />
			<About />
			<Newsletter />
		</>
	);
}
