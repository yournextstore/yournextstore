import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { FeatureRow } from "@/components/sections/feature-row";
import { FounderStory } from "@/components/sections/founder-story";
import { Hero } from "@/components/sections/hero";
import { IngredientStory } from "@/components/sections/ingredient-story";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section
			className="px-6 sm:px-10 lg:px-14 py-20 lg:py-28 border-y border-foreground/10"
			style={{ backgroundColor: "#f0e7d6" }}
		>
			<div className="mb-12">
				<div className="h-3 w-32 bg-foreground/10 mb-5 animate-pulse" />
				<div className="h-12 w-72 bg-foreground/10 animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-px gap-y-16">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] mb-5 animate-pulse" style={{ backgroundColor: "#e8dcc6" }} />
						<div className="h-5 w-3/4 bg-foreground/10 animate-pulse mb-2" />
						<div className="h-3 w-1/3 bg-foreground/10 animate-pulse" />
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
			<IngredientStory />
			<FeatureRow />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Lineup" limit={6} />
			</Suspense>
			<FounderStory />
			<PressStrip />
			<About />
			<Newsletter />
		</>
	);
}
