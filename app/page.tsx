import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollectionSpotlight } from "@/components/sections/collection-spotlight";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { PressStrip } from "@/components/sections/press-strip";
import { ProductGrid } from "@/components/sections/product-grid";
import { ValuesStrip } from "@/components/sections/values-strip";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-12">
				<div>
					<div className="h-3 w-24 bg-blush-soft rounded animate-pulse" />
					<div className="mt-3 h-10 w-72 bg-blush-soft rounded animate-pulse" />
					<div className="mt-3 h-4 w-64 bg-blush-soft rounded animate-pulse" />
				</div>
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-x-5 gap-y-12 sm:gap-x-8">
				{Array.from({ length: 8 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-[4/5] bg-blush-soft rounded-3xl mb-4 animate-pulse" />
						<div className="space-y-2 px-1">
							<div className="h-5 w-3/4 bg-blush-soft rounded animate-pulse" />
							<div className="h-4 w-1/4 bg-blush-soft rounded animate-pulse" />
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
				<ProductGrid limit={8} />
			</Suspense>
			<ValuesStrip />
			<Suspense>
				<CollectionSpotlight />
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
