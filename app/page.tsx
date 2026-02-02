import { Suspense } from "react";
import { Hero } from "@/components/sections/hero";
import { ProductGrid } from "@/components/sections/product-grid";

function ProductGridSkeleton() {
	return (
		<section className="relative pt-28 pb-16">
			<div className="max-w-[1132px] mx-auto px-4">
				<div className="text-center mb-12">
					<div className="h-12 w-72 bg-secondary rounded animate-pulse mx-auto mb-4" />
					<div className="h-5 w-96 bg-secondary rounded animate-pulse mx-auto" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={`skeleton-${i}`}
							className="border border-gray-600 border-b-[3px] border-b-hy-pink bg-card rounded overflow-hidden"
						>
							<div className="aspect-square bg-secondary animate-pulse" />
							<div className="p-6 space-y-3">
								<div className="h-5 w-3/4 bg-secondary rounded animate-pulse" />
								<div className="h-6 w-1/3 bg-secondary rounded animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default function Home() {
	return (
		<main>
			<Hero />
			<Suspense fallback={<ProductGridSkeleton />}>
				<ProductGrid title="Featured Products" limit={6} />
			</Suspense>
		</main>
	);
}
