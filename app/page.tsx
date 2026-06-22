import { Suspense } from "react";
import { CategoryTiles } from "@/components/sections/category-tiles";
import { Hero } from "@/components/sections/hero";
import { IngredientStory } from "@/components/sections/ingredient-story";
import { KitBanner } from "@/components/sections/kit-banner";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="px-4 sm:px-8 lg:px-12 py-20 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-4 w-32 bg-secondary rounded animate-pulse" />
					<div className="mt-3 h-8 w-48 bg-secondary rounded animate-pulse" />
					<div className="mt-2 h-5 w-64 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 sm:gap-x-8">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-secondary mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-3 w-20 bg-secondary rounded animate-pulse" />
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
			<CategoryTiles />
			<IngredientStory />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid
					title="Best Sellers"
					eyebrow="The Catalogue"
					description="Apothecary essentials in amber glass and minimal aluminum — clinically dosed actives, no fillers."
					limit={4}
					tone="stone"
				/>
			</Suspense>
			<KitBanner />
			<PressStrip />
			<Newsletter />
		</>
	);
}
