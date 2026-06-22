import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { LandscapeBand } from "@/components/sections/landscape-band";
import { Newsletter } from "@/components/sections/newsletter";
import { Press } from "@/components/sections/press";
import { ProductGrid } from "@/components/sections/product-grid";
import { Recipes } from "@/components/sections/recipes";
import { Wholesale } from "@/components/sections/wholesale";

function ProductGridSkeleton() {
	return (
		<section className="mx-auto max-w-[1400px] px-6 py-20 sm:px-10 sm:py-28">
			<div className="mb-14 flex items-end justify-between">
				<div>
					<div className="mb-3 h-3 w-24 animate-pulse rounded bg-secondary" />
					<div className="h-10 w-64 animate-pulse rounded bg-secondary" />
				</div>
			</div>
			<div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="mb-4 aspect-square animate-pulse rounded-sm bg-secondary" />
						<div className="space-y-2">
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
			<LandscapeBand />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="the jars" limit={6} />
			</Suspense>
			<About />
			<Recipes />
			<Press />
			<Wholesale />
			<Newsletter />
		</>
	);
}
