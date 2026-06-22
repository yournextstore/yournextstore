import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { FlavorRow } from "@/components/sections/flavor-row";
import { Hero } from "@/components/sections/hero";
import { IngredientStory } from "@/components/sections/ingredient-story";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { UgcMosaic } from "@/components/sections/ugc-mosaic";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-4 w-32 bg-secondary rounded animate-pulse" />
					<div className="mt-3 h-10 w-72 bg-secondary rounded animate-pulse" />
					<div className="mt-3 h-5 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-3xl mb-4 animate-pulse" />
						<div className="flex items-center justify-between">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-7 w-16 bg-secondary rounded-full animate-pulse" />
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
			<FlavorRow />
			<IngredientStory />
			<PressStrip />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Subscribe & save bundles"
					description="Mix three flavors. Skip, swap or cancel any time. Always 15% off."
					limit={6}
				/>
			</Suspense>
			<About />
			<UgcMosaic />
			<Newsletter />
		</>
	);
}
