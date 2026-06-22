import { Suspense } from "react";
import { About, PromoCard } from "@/components/sections/about";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
			<div className="mb-12">
				<div className="h-4 w-32 bg-secondary rounded animate-pulse" />
				<div className="mt-3 h-10 w-72 bg-secondary rounded animate-pulse" />
				<div className="mt-3 h-5 w-80 bg-secondary rounded animate-pulse" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={`skeleton-${i}`}>
						<div className="aspect-square bg-secondary rounded-[2rem] animate-pulse" />
						<div className="mt-4 h-5 w-3/4 bg-secondary rounded animate-pulse" />
					</div>
				))}
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<PromoCard />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid />
			</Suspense>
			<About />
		</main>
	);
}
