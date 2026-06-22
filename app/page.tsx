import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollectionsStrip } from "@/components/sections/collections-strip";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
			<div className="flex items-end justify-between mb-10">
				<div>
					<div className="h-4 w-32 bg-secondary rounded animate-pulse mb-3" />
					<div className="h-9 w-64 bg-secondary rounded animate-pulse" />
					<div className="mt-3 h-5 w-72 bg-secondary rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-2xl mb-3 animate-pulse" />
						<div className="space-y-2 px-1">
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
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Fresh this week" limit={8} />
			</Suspense>
			<Suspense>
				<CollectionsStrip />
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
