import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { CollectionsStrip } from "@/components/sections/collections-strip";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
			<div className="mb-12 space-y-3">
				<div className="h-6 w-24 bg-secondary rounded-full animate-pulse" />
				<div className="h-10 w-72 bg-secondary rounded animate-pulse" />
				<div className="mt-2 h-5 w-96 bg-secondary rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-3xl mb-4 animate-pulse" />
						<div className="space-y-2">
							<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
							<div className="h-5 w-1/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

function CollectionsStripSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={`tile-${i}`} className="aspect-[3/4] bg-secondary rounded-3xl animate-pulse" />
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<>
			<Hero />
			<Suspense fallback={<CollectionsStripSkeleton />}>
				<CollectionsStrip />
			</Suspense>
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="The collection" limit={6} />
			</Suspense>
			<About />
			<Newsletter />
		</>
	);
}
