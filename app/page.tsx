import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { FindUs } from "@/components/sections/find-us";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { RecipeFeature } from "@/components/sections/recipe-feature";

function ProductGridSkeleton() {
	return (
		<section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12 py-20 sm:py-28">
			<div className="flex items-end justify-between mb-14">
				<div>
					<div className="h-3 w-32 bg-secondary animate-pulse" />
					<div className="mt-4 h-12 w-72 bg-secondary animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary animate-pulse" />
							<div className="h-4 w-1/3 bg-secondary animate-pulse" />
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
			<PressStrip />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The Hot Shelf" limit={8} />
			</Suspense>
			<About />
			<RecipeFeature />
			<FindUs />
			<Newsletter />
		</>
	);
}
