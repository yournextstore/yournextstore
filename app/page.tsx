import { Suspense } from "react";
import { About } from "@/components/sections/about";
import { BuildPromo } from "@/components/sections/build-promo";
import { Categories } from "@/components/sections/categories";
import { Hero } from "@/components/sections/hero";
import { Newsletter } from "@/components/sections/newsletter";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
			<div className="flex items-end justify-between mb-10 sm:mb-14">
				<div className="h-12 w-48 bg-secondary rounded animate-pulse" />
				<div className="h-10 w-24 bg-secondary rounded-full animate-pulse" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-2xl mb-3 animate-pulse" />
						<div className="space-y-2 px-1">
							<div className="h-4 w-3/4 bg-secondary rounded animate-pulse" />
						</div>
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main className="relative">
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="/featured" limit={6} />
			</Suspense>
			<Categories />
			<BuildPromo />
			<About />
			<Newsletter />
		</main>
	);
}
